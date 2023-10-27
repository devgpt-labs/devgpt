import { supabase } from "./supabase";

const addTeamMember = async (
	emailOfNewMember: string,
	nameOfNewMember: string,
	team: any,
	setTeam: any
) => {
	if (!supabase) return;

	const newMember: any = {
		name: nameOfNewMember,
		email: emailOfNewMember,
		accepted: false,
	};

	console.log(team);

	if (!team) {
		return null;
	}

	// // If team.members already contains the new member, return
	// if (team?.members.find((member: any) => member.email === emailOfNewMember)) {
	// 	return null;
	// }

	// If no email and name, return
	if (!emailOfNewMember || !nameOfNewMember) return null;

	const newTeamMembers = [...team.members, newMember];

	// Set local state
	setTeam({ ...team, members: newTeamMembers });

	// Update supabase with new team
	const { error }: any = await supabase
		.from("teams")
		.update({ members: newTeamMembers })
		.eq("id", team.id);

	const teamInvite = { team: team.id, accepted: false };

	console.log({ emailOfNewMember });

	const { data: insertCustomerData, error: insertCustomerTeamError } =
		await supabase
			.from("customers")
			.update({ invites: teamInvite })
			.eq("email_address", emailOfNewMember);

	if (insertCustomerData) console.log("data", { insertCustomerData });

	if (insertCustomerTeamError) {
		console.warn({ insertCustomerTeamError });
	}

	if (error) {
		console.warn({ error });
	}
};

export default addTeamMember;
