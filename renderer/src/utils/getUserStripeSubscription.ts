import Stripe from "stripe";
import dotenv from "dotenv";

interface Response {
  user_id: string;
  activeSubscription: boolean;
  subscription: any;
}

const token = process?.env?.NEXT_PUBLIC_STRIPE_KEY
  ? process?.env?.NEXT_PUBLIC_STRIPE_KEY
  : "";

const stripe = new Stripe(token, {
  apiVersion: "2022-11-15",
});

const getUserStripeSubscription = async (
  stripe_id: string,
  user_id: string
) => {
  if (stripe_id && user_id && stripe) {
    const fetchSubscription: any = await stripe?.checkout?.sessions?.retrieve(
      stripe_id
    );
    if (
      fetchSubscription &&
      fetchSubscription.client_reference_id === user_id
    ) {
      const subscription = await stripe.subscriptions.retrieve(
        fetchSubscription?.subscription
      );
      if (
        (subscription && subscription.status === "active") ||
        subscription.status === "trialing"
      ) {
        const response: Response = {
          user_id: user_id,
          activeSubscription: true,
          subscription: subscription,
        };
        return response;
      } else {
        const response: Response = {
          user_id: user_id,
          activeSubscription: false,
          subscription: "expired",
        };
        return response;
      }
    } else {
      const response: Response = {
        user_id: user_id,
        activeSubscription: false,
        subscription: "does not exist",
      };
      return response;
    }
  } else {
    const response: Response = {
      user_id: user_id,
      activeSubscription: false,
      subscription: "does not exist",
    };
    return response;
  }
};

export default getUserStripeSubscription;