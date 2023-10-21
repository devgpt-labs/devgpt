import { supabase } from "@/utils/supabase";

const getCustomerSpendThisMonth = async (stripe_customer_id: any) => {
  if (!supabase) return;
  //check total spend for this customer this month with Stripe
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("stripe_id", stripe_customer_id);
  if (error) return error;
  const payments = data;

  //filter to payments that have been created_at this month
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
    total_spend_this_month += payment.price / 100; //convert from cents to dollars
  });

  return total_spend_this_month;
};

export default getCustomerSpendThisMonth;
