//this function checks if the user is a pro user (has a pro plan)
import Stripe from "stripe";

import { supabase } from "@/utils/supabase";
import planIntegers from "@/configs/planIntegers";
import getTeam from "./getTeam";

const token = process?.env?.NEXT_PUBLIC_STRIPE_KEY
	? process?.env?.NEXT_PUBLIC_STRIPE_KEY
	: "";

const stripe = new Stripe(token, {
	apiVersion: "2023-08-16",
});

const checkIfPro = async (emailAddress: string) => {
	if (!emailAddress) {
		console.warn("No email address provided");
		return false;
	}

	if (!supabase) {
		console.warn(
			"Supabase is not configured correctly. Please check the .env file."
		);
		return false;
	}

	// Find the customer stripe via email
	const found_customer = await stripe.customers.search({
		query: `email:'${emailAddress}'`,
	});

	// Get the customer ID
	const stripe_customer_id = found_customer?.data?.[0]?.id;

	// If no ID exists, return, as there is no customer
	if (!stripe_customer_id) {
		console.warn("No stripe_customer_id found for this user");
		return false;
	}

	// Retrieve the customers subscription from Stripe via the ID
	const customer: any = await stripe.customers.retrieve(stripe_customer_id, {
		expand: ["subscriptions"],
	});

	// Define the users plan ID stored in Stripe
	const subscriptionType = customer?.subscriptions?.data?.[0]?.plan?.id;

	// If no customer exists, return, as there is no customer
	if (!customer) {
		console.warn("No customer found with this stripe_customer_id");
		return false;
	}

	// Check through planIntegers and find which plan has the subscriptionType
	const activePlan = Object.keys(planIntegers).find((plan: any) => {
		return planIntegers?.[plan]?.id === subscriptionType;
	});

	// If the plan is business, we should create a team (if one doesn't exist)
	if (activePlan === "business") {
		// Check if a team exists
		const { data: teamData, error: teamError } = await supabase
			.from("teams")
			.select("*")
			.eq("owner", customer?.email);

		if (teamError) {
			console.warn(teamError);
		}

		// If no team exists, create one
		if (!teamData || teamData?.length === 0) {
			const { error: insertTeamError }: any = await supabase
				.from("teams")
				.insert([
					{
						owner: customer?.email,
						name: `${customer?.email}'s Team`,
						members: [
							{
								name: customer?.email,
								email: customer?.email,
								accepted: true,
							},
						],
					},
				])
				.eq("owner", customer?.email);

			if (insertTeamError) {
				console.warn(insertTeamError);
			}
		}

		return "business";
	}

	// Check if the user is on a team
	const team = await getTeam(emailAddress);

	// If the user is on a team, return 'member'
	if (team) {
		return "member";
	}

	// If none of the above apply, check on their individual subscription to ensure it's active
	if (
		customer?.subscriptions?.data?.[0]?.status === "active" ||
		customer?.subscriptions?.data?.[0]?.status === "trialing"
	) {
		return activePlan;
	} else {
		return false;
	}
};

export { checkIfPro };
