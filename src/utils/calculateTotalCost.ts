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

  return newCost;
};

export default calculateTotalCost;
