import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/utils/supabase";

const token = process?.env?.NEXT_PUBLIC_STRIPE_KEY
  ? process?.env?.NEXT_PUBLIC_STRIPE_KEY
  : "notoken";

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

const stripe = new Stripe(token, {
  apiVersion: "2023-08-16",
});

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

  customers_to_charge.forEach((customer: any) => {
    chargeCustomer(customer);
  });

  return { customers_to_charge, now };
}

const chargeCustomer = async (customer: any) => {
  if (!supabase) return;

  //check total spend for this customer this month with Stripe
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("stripe_id", customer.stripe_customer_id);
  if (error) return error;
  const payments = data;

  //filter to  payments that have been created_at this month
  const now = Date.now();
  const thisMonth = new Date(now).getMonth();
  const thisYear = new Date(now).getFullYear();
  const thisMonthPayments: any = payments.filter((payment: any) => {
    const paymentDate = new Date(payment.created_at);
    const paymentMonth = paymentDate.getMonth();
    const paymentYear = paymentDate.getFullYear();
    return paymentMonth === thisMonth && paymentYear === thisYear;
  });

  let total_spend_this_month = 0;

  //add up the total spend for this month
  thisMonthPayments.forEach((payment: any) => {
    total_spend_this_month += payment.price;
  });

  //check if we can still charge this customer or if they've reached their monthly budget
  const monthly_budget = customer.monthly_budget;
  const canChargeCustomer: boolean = total_spend_this_month < monthly_budget;
  const maxWeCanChargeCustomer = monthly_budget - total_spend_this_month;

  console.log({ canChargeCustomer, maxWeCanChargeCustomer });

  //calculate the amount to charge this customer based on their estimated spend from models + prompts.
  const { data: modelData, error: modelError } = await supabase
    .from("models")
    .select("*")
    .eq("stripe_customer_id", customer.stripe_customer_id);
  if (error) return error;
  const models = modelData;

  console.log("models", models);
};
