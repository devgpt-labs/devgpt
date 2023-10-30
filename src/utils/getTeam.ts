import { supabase } from "./supabase";

const getTeam = async (email: any) => {
	if (!supabase) return null;
	if (!email) return null;

	// Get all teams, check if the customer?.email is in any of the teams 'members' array, if so, return 'member'
	const { data: teamsData, error: teamsError } = await supabase
		.from("teams")
		.select("*");

	if (teamsError) {
		console.warn(teamsError);
	}

	if (teamsData) {
		const team = teamsData.filter((team: any) => {
			return team?.members?.find((member: any) => {
				return member?.email === email;
			});
		});

		if (team?.length > 0) {
			return team[0]
		}
	}
};

export default getTeam;
