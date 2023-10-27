//this function checks if the user is a pro user (has a pro plan)
import Stripe from "stripe";

import { supabase } from "@/utils/supabase";
import planIntegers from "@/configs/planIntegers";

const token = process?.env?.NEXT_PUBLIC_STRIPE_KEY
	? process?.env?.NEXT_PUBLIC_STRIPE_KEY
	: "";

const stripe = new Stripe(token, {
	apiVersion: "2023-08-16",
});

const checkIfPro = async (emailAddress: string, invites: any) => {
	if (!emailAddress) {
		console.warn("No email address provided");
		return false;
	}

	if (!supabase) {
		console.warn("Supabase is not configured correctly. Please check the .env file.");
		return false;
	}

	const found_customer = await stripe.customers.search({
		query: `email:'${emailAddress}'`,
	});

	const stripe_customer_id = found_customer?.data?.[0]?.id;

	if (!stripe_customer_id) {
		console.warn("No stripe_customer_id found for this user");
		return false;
	}

	const customer: any = await stripe.customers.retrieve(stripe_customer_id, {
		expand: ["subscriptions"],
	});

	const subscriptionType = customer?.subscriptions?.data?.[0]?.plan?.id;

	console.log({ subscriptionType });
	if (!customer) {
		console.warn("No customer found with this stripe_customer_id");
		return false;
	}

	// Check through planIntegers and find which plan has the subscriptionType
	const activePlan = Object.keys(planIntegers).find((plan: any) => {
		
		return planIntegers?.[plan]?.id === subscriptionType;
	});

	console.log({ activePlan });
	console.log({ invites });

	if (activePlan === "business") {
		// Check if a team already exists that was created by this user, if so, return nothing, if not, create a team
		const { data: teamData, error: teamError } = await supabase
			.from("teams")
			.select("*")
			.eq("owner", customer?.email);

		if (teamError) {
			console.warn(teamError);
		}

		if (!teamData || teamData?.length === 0) {
			// Create a new team
			const { data: insertTeamData, error: insertTeamError }: any =
				await supabase
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

			// Invite the owner of the team to the team
			const { error: inviteError } = await supabase
				.from("customers")
				.update({ invites: { team: insertTeamData?.[0]?.id, accepted: true } })
				.eq("email_address", customer?.email);

			if (insertTeamError) {
				console.warn(insertTeamError);
			}

			if (inviteError) {
				console.warn(inviteError);
			}
		}

		return "business";
	}

	// If the user has an invite to a team, set their activePlan as 'member'
	if (invites?.length > 0) {
		return "member";
	}

	console.log(invites);
	

	if (
		customer?.subscriptions?.data?.[0]?.status === "active" ||
		customer?.subscriptions?.data?.[0]?.status === "trialing"
	) {
		return activePlan;
	} else {
		console.log('no problems')
		return false;
	}
};

export { checkIfPro };
