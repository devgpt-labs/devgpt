import { supabase } from "@/src/utils/supabase/supabase";
import getUserStripeSubscription from "./getUserStripeSubscription";

interface Response {
  user_id: string;
  activeSubscription: boolean;
  subscription: any;
}

const getUserSubscription = async (user_id: string) => {
  if (user_id && supabase) {
    const devMode = process?.env?.NEXT_PUBLIC_DEVELOPER_MODE;
    if (devMode === "true") {
      const response: Response = {
        user_id: user_id,
        activeSubscription: true,
        subscription: "premium",
      };
      return response;
    } else {
      const fetchSubscription = await supabase
        .from("payments")
        .select("stripe_id")
        .eq("user_id", user_id)

      if (fetchSubscription.error) {
        return {
          user_id,
          activeSubscription: false,
          subscription: null
        }
      }
      if (fetchSubscription.data.length === 1) {
        const { stripe_id } = fetchSubscription.data[0]
        if (stripe_id) {
          const fetchStripeSubscription: Response = await getUserStripeSubscription(stripe_id, user_id);
          if (fetchStripeSubscription) {
            return fetchStripeSubscription
          }
        } else {
          return {
            user_id,
            activeSubscription: false,
            subscription: null
          }
        }
      } 
      if (fetchSubscription.data.length > 1) {
        for (const subscription of fetchSubscription.data) {
          const { stripe_id } = subscription;
          if (stripe_id) {
            const fetchStripeSubscription: Response = await getUserStripeSubscription(stripe_id, user_id);
            if (fetchStripeSubscription) {
              return fetchStripeSubscription
            }
          } else {
            return {
              user_id,
              activeSubscription: false,
              subscription: null
            }
          }
        }

      }
      else {
        return {
          user_id,
          activeSubscription: false,
          subscription: null
        }
      }
    }
  }
}

export default getUserSubscription;