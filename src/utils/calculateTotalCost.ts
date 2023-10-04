const calculateTotalCost = (modelsInTraining: any, addition: number) => {
  let cost = 0;

  modelsInTraining.forEach((model: any) => {
    const costPerSample = 0.75; //in dollars
    const trainingsPerMonth = model.frequency;
    const costPerTraining = costPerSample * model.epochs * model.sample_size;
    cost += trainingsPerMonth * costPerTraining;
  });

  // Add these two together as numbers not as strings
  const newCost = Number(cost) + Number(addition);

	// If newCost is not a number, return 0
	if (isNaN(newCost)) {
		return 0;
	}

	// Return the final cost, rounded to 2 decimal places
	return newCost.toFixed(2)

};

export default calculateTotalCost;
