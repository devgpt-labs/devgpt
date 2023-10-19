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

const setUserToPaymentOverdue = async (email: string) => {
	if (!supabase) return;

	const newStatus = {
		isOverdue: true,
	};

	const { data: overdueData, error: overdueError } = await supabase
		.from("customers")
		.update({ status: JSON.stringify(newStatus) })
		.eq("email_address", email)
		.select();

	if (overdueError) {
		console.log({ overdueError });
		return;
	}
};

const chargeCustomer = async (customer: any, amount: number, email: any) => {
	if (!supabase) return;

	amount = Number(amount);

	//get the customer's account balance from supabase
	const { data: creditsData, error: creditsError } = await supabase
		.from("customers")
		.select("*")
		.eq("email_address", email)
		.single();

	if (creditsError) {
		console.log({ creditsError });
		return;
	}

	const { credits, monthly_budget }: any = creditsData;

	// Remove the amount from the customer's account balance
	const { data: removeCreditsData, error: removeCreditsError } = await supabase
		.from("customers")
		.update({ credits: (credits - amount).toFixed(2) })
		.eq("email_address", email)
		.select();

	if (removeCreditsError) {
		console.log({ removeCreditsError });
		return;
	}

	// the user failed credit removal, meaning the user has to make a payment
	if (!customer.stripe_customer_id) {
		setUserToPaymentOverdue(email);
		return;
	}

	const { maxWeCanChargeCustomer, canChargeCustomer }: any =
		await getCustomerChargeLimits(customer.stripe_customer_id, monthly_budget);

	if (!canChargeCustomer) {
		setUserToPaymentOverdue(email);
		return;
	}

	const paymentMethods = await stripe.customers.listPaymentMethods(
		customer.stripe_customer_id,
		{ type: "card" }
	);

	const payment_method = paymentMethods.data[0].id;

	amount = amount < minimum_charge ? minimum_charge : amount;

	const amountWithCaps =
		amount > maxWeCanChargeCustomer ? maxWeCanChargeCustomer : amount;

	if (amountWithCaps <= 0) {
		setUserToPaymentOverdue(email);
		return;
	}

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

	if (
		confirmation.status === "requires_action" ||
		confirmation.status === "canceled" ||
		confirmation.status === "requires_payment_method"
	) {
		setUserToPaymentOverdue(email);
	}

	if (!paymentIntent) {
		setUserToPaymentOverdue(email);
		return;
	}
};

export default chargeCustomer;
