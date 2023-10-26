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

	// If team.members already contains the new member, return
	if (team.members.find((member: any) => member.email === emailOfNewMember)) {
		return null;
	}

	// If no email and name, return
	if (!emailOfNewMember || !nameOfNewMember) return null;

	const newTeamMembers = [...team.members, newMember];

	// Set local state
	setTeam({ ...team, members: newTeamMembers });

	// Update supabase with new team
	const { data, error }: any = await supabase
		.from("teams")
		.update({ members: newTeamMembers })
		.eq("id", team.id);

	if (error) {
		console.log("err", { error });
	}

	if (data) {
		console.log("data", { data });
	}
};

export default addTeamMember;
