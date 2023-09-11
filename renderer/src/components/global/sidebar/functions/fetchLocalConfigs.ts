import { useAuthContext } from "@/src/context";
import { supabase } from "@/src/utils/supabaseClient";
import countFilesInDirectory from "@/src/utils/countFilesInDirectory";

interface ISetLocalConfigs {
	setTechnologiesUsed: React.Dispatch<React.SetStateAction<string>>;
	setContext: any;
	setLocalRepoDirectory: React.Dispatch<React.SetStateAction<string>>;
	setFileTypesToRemove: any;
	setFetched: any;
	user: any;
}

const fetchLocalConfigs = async ({
	setTechnologiesUsed,
	setContext,
	setLocalRepoDirectory,
	setFileTypesToRemove,
	setFetched,
	user,
}: ISetLocalConfigs) => {
	if (user && supabase) {
		const { data, error } = await supabase
			.from("profiles")
			.select("*")
			.eq("id", user?.id)
			.single();

		if (data?.technologies_used) {
			setTechnologiesUsed(data?.technologies_used);
		}

		if (data?.files_to_ignore) {
			setFileTypesToRemove(data?.files_to_ignore);
		}

		if (data?.context) {
			setContext(data?.context);
		}

		if (data?.local_repo_dir) {
			setLocalRepoDirectory(data?.local_repo_dir);
		}
		setFetched(true);
	}
};

export default fetchLocalConfigs;
