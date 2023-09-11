import router from "next/router";
import Transaction from "@/src/components/platform/transaction";

export default function TransactionsPage() {
  const { id } = router.query;

  return (
    <Transaction transaction_id={id} />
  );
}