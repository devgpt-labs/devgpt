import { supabase } from "./supabase";

const handleTeamInvite = (
	emailOfNewMember: any,
	choice: any,
	team: any,
	invites: any,
	setTeam: any,
	setInvites: any
) => {
	if (!supabase) return;

	if (choice === "accept") {
		const updatedMembers = team.members.map((member: any) => {
			if (member.email === emailOfNewMember) {
				return {
					...member,
					accepted: true,
				};
			} else {
				return member;
			}
		});

		// Update local state
		setTeam({ ...team, members: updatedMembers });

		const { data, error }: any = supabase
			.from("teams")
			.update({ members: updatedMembers })
			.eq("id", team.id);

		if (error) {
			console.warn({ error });
		}
	} else {
		// Delete the invite from the users customer row 'invites' in supabase
		const newInvites = invites.filter((invite: any) => {
			return invite !== team.id;
		});

		const { data, error }: any = supabase
			.from("customers")
			.update({ invites: newInvites })
			.eq("email_address", emailOfNewMember);

		if (error) {
			console.warn({ error });
		}
	}
};

export default handleTeamInvite;
