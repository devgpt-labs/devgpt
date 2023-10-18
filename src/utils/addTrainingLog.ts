import calculateTotalCost from "./calculateTotalCost";
import { supabase } from "./supabase";
import chargeCustomer from "./stripe/chargeCustomer";
import createModelID from "./createModelID";

interface Model {
	created_at: string;
	stripe_customer_id: string;
	repo: string;
	owner: string;
	branch: string;
	epochs: number;
	training_method: string;
	frequency: number;
	sample_size: number;
	output: any;
	deleted: boolean;
	email_address: string;
}

const addTrainingLog = async (model: Model) => {
	if (!supabase) return "No supabase client found";

	//add training log for this model
	const { data: logData, error: logError }: any = await supabase
		.from("training_log")
		.insert([
			{
				model_id: createModelID(model.repo, model.owner, model.branch),
				model_settings: JSON.stringify(model),
				fulfilled: false,
			},
		]);

	//calculate cost of training this model
	const costToTrain = calculateTotalCost([model], 0);

	//create a new charge
	chargeCustomer(
		{
			stripe_customer_id: model.stripe_customer_id,
		},
		Number(costToTrain),
		model?.email_address
	);
};

export default addTrainingLog;
