import { supabase } from "@/src/utils/supabase/supabase";

const calculateUserRanking = async (user) => {
  try {
    // Get all transactions from supabase, then figure out where this user ranks in terms of most transactions completed
    const user_id = user?.id;
    const { data, error } = await supabase.from("new_transactions").select("*");

    if (error) {
      throw new Error("fail - error fetching transactions");
    }

    // Create a count map to see how many transactions each user has
    const userTransactionCount = {};
    data?.forEach((transaction) => {
      userTransactionCount[transaction.user_id] =
        (userTransactionCount[transaction.user_id] || 0) + 1;
    });

    // Convert to an array and sort by transactions
    const sortedUsers = Object.entries(userTransactionCount).sort(
      (a, b) => b[1] - a[1]
    );

    // Find the index of the current user's transactions
    const userIndex = sortedUsers.findIndex(
      ([userId]) => userId === user_id.toString()
    );

    // Calculate the user's ranking percentage
    const userRanking = (userIndex / sortedUsers.length) * 100;

    return `${Math.round(userRanking)}%`;
  } catch (error) {
    return "99%";
  }
};

export default calculateUserRanking;
