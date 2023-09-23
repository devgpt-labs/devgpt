import { checkIfPro } from "./checkIfPro";

const getTokenLimit = async (email_address: string) => {
	const free_limit = 3800;
	const pro_limit = 18000;

	const isPro: any = await checkIfPro(email_address);

	if (isPro) {
		return pro_limit;
	} else {
		return free_limit;
	}
};
export default getTokenLimit;
