import Stripe from "stripe";
import { supabase } from "@/utils/supabase";

//utils
import getCustomerChargeLimits from "./getCustomerChargeLimits";

const token = process?.env?.NEXT_PUBLIC_STRIPE_KEY
  ? process?.env?.NEXT_PUBLIC_STRIPE_KEY
  : "notoken";

const stripe = new Stripe(token, {
  apiVersion: "2023-08-16",
});

const minimum_charge = 10; //10 dollars

const chargeCustomer = async (customer: any, amount: number) => {
  if (!supabase) return;

  amount = Number(amount);

  //get the customer's account balance from supabase
  const { data: creditsData, error: creditsError } = await supabase
    .from("customers")
    .select("*")
    .eq("stripe_customer_id", customer.stripe_customer_id)
    .single();

  if (creditsError) {
    console.log(creditsError);
    return;
  }

  const { credits, monthly_budget }: any = creditsData;

  if (amount < credits) {
    // Remove the amount from the customer's account balance
    const { data: removeCreditsData, error: removeCreditsError } =
      await supabase
        .from("customers")
        .update({ credits: (credits - amount).toFixed(2) })
        .eq("stripe_customer_id", customer.stripe_customer_id)
        .select();

    if (removeCreditsError) {
      console.log(removeCreditsError);
      return;
    }

    return;
  }

  const { maxWeCanChargeCustomer, canChargeCustomer }: any =
    await getCustomerChargeLimits(customer, monthly_budget);

  if (!canChargeCustomer) return;

  const paymentMethods = await stripe.customers.listPaymentMethods(
    customer.stripe_customer_id,
    { type: "card" }
  );

  const payment_method = paymentMethods.data[0].id;

  amount = amount < minimum_charge ? minimum_charge : amount;

  const amountWithCaps =
    amount > maxWeCanChargeCustomer ? maxWeCanChargeCustomer : amount;

  if (amountWithCaps <= 0) return;

  //use stripe to charge the customer
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountWithCaps * 100,
    currency: "usd",
    customer: customer.stripe_customer_id,
    automatic_payment_methods: {
      enabled: true,
      allow_redirects: "never",
    },
  });

  //use the paymentIntent to charge the customer
  const confirmation = await stripe.paymentIntents.confirm(paymentIntent.id, {
    payment_method: payment_method,
  });

  if (!paymentIntent) return false;
};

export default chargeCustomer;
