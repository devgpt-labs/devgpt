//this function checks if the user is a pro user (has a pro plan)
import Stripe from "stripe";

import { supabase } from "@/utils/supabase";

const token = process?.env?.NEXT_PUBLIC_STRIPE_KEY
  ? process?.env?.NEXT_PUBLIC_STRIPE_KEY
  : "";

const stripe = new Stripe(token, {
  apiVersion: "2023-08-16",
});

const checkIfPro = async (emailAddress: string) => {
  const errorHandler = (error: any) => {
    console.warn(error);
  };

  if (!emailAddress) {
    errorHandler("No email address provided");
    return false;
  }

  if (!supabase) {
    errorHandler(
      "Supabase is not configured correctly. Please check the .env file."
    );
    return false;
  }

  //get this user's stripe_customer_id from Supabase
  const { data, error } = await supabase
    .from("customers")
    .select("stripe_customer_id")
    .eq("email_address", emailAddress);

  if (error) {
    errorHandler(error);
    return false;
  }

  if (data.length === 0) {
    errorHandler("No user found with this email address");
    return false;
  }

  const stripe_customer_id = data?.[0]?.stripe_customer_id;

  if (!stripe_customer_id) {
    errorHandler("No stripe_customer_id found for this user");
    return false;
  }

  const customer: any = await stripe.customers.retrieve(stripe_customer_id, {
    expand: ["subscriptions"],
  });

  if (!customer) {
    errorHandler("No customer found with this stripe_customer_id");
    return false;
  }

  if (customer?.subscriptions?.data?.[0]?.status === "active") {
    return true;
  } else {
    return false;
  }
};

export { checkIfPro };
