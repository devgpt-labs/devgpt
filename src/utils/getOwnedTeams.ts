import { supabase } from "./supabase";

const getOwnedTeams = async (setState: any, invites: any, email: any) => {
	if (!supabase) return null;
	if (!invites) return null;

	// Find any teams that the user is the owner of by email
	const { data: teamsData, error: teamsError } = await supabase
		.from("teams")
		.select("*")
		.eq("owner", email);

	if (teamsError) {
		console.log({ teamsError });
	}

	if (teamsData) {
		return setState(teamsData);
	}

	// Finds any teams that have the ids from the invites array
	const { data: invitedTeamsData, error: invitedTeamsError } = await supabase
		.from("teams")
		.select("*")
		.in(
			"id",
			invites.map((invite: any) => invite)
		);

	if (invitedTeamsError) {
		console.log({ invitedTeamsError });
		return null;
	}

	if (invitedTeamsData) {
		return setState(invitedTeamsData);
	}
};

export default getOwnedTeams;