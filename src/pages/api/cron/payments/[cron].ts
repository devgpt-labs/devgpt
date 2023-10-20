import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/utils/supabase";

//utils
import chargeCustomer from "@/utils/stripe/chargeCustomer";
import calculateTotalCost from "@/utils/calculateTotalCost";

const token = process?.env?.NEXT_PUBLIC_STRIPE_KEY
  ? process?.env?.NEXT_PUBLIC_STRIPE_KEY
  : "notoken";

const stripe = new Stripe(token, {
  apiVersion: "2023-08-16",
});

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  const cron = req.nextUrl.pathname.split("/")[3];
  if (!cron) return new Response("No cron provided", { status: 400 });
  const response = await update(cron);
  return new NextResponse(JSON.stringify(response), {
    status: 200,
  });
}

async function update(interval: string) {
  const now = Date.now();

  if (!supabase) return "No supabase client found";

  //get all customers from supabase
  const { data, error } = await supabase.from("customers").select("*");
  if (error) return error;
  const customers = data;

  const customers_to_charge: any = [];

  customers.forEach(async (customer) => {
    const monthly_budget = customer.monthly_budget;
    const credits = customer.credits;
    const minimum_budget_threshold = monthly_budget * 0.1;
    if (credits < minimum_budget_threshold) {
      customers_to_charge.push(customer);
    }
  });

  const customers_with_payments_required: any = [];

  //async calculate charge for each customer
  for (const customer of customers_to_charge) {
    const charge = await calculateCharge(customer);
    customers_with_payments_required.push({ customer, charge });
  }

  // charge customers
  for (const customer of customers_with_payments_required) {
    await chargeCustomer(customer.customer, customer.charge, customer.email_address);
  }

  return { customers_with_payments_required, now };
}

const calculateCharge = async (customer: any) => {
  if (!supabase) return;

  //calculate the amount to charge this customer based on their estimated spend from models + prompts.
  const { data: modelData, error: modelError } = await supabase
    .from("models")
    .select("*")
    .eq("email_address", customer.email_address);
  if (modelError) return modelError;
  const models = modelData;

  let estimatedCost = calculateTotalCost(models, 0);

  estimatedCost = (Number(estimatedCost) * 1.2).toFixed(2); // add 20% buffer for prompting costs

  return estimatedCost;
};
