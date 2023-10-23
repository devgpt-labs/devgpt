const planIntegers = {
	pro: {
		name: 'Pro',
		models: 1,
		training_rounds: 7,
		prompts: 75,
		price: '$49',
		team_members: 1,
	},
	team: {
		name: 'Team',
		models: 3,
		training_rounds: 15,
		prompts: 750,
		price: '$499',
		team_members: 12,
	},
	enterprise: {
		name: 'Enterprise',
		models: '∞',
		training_rounds: 100,
		prompts: '∞',
		price: 'contact',
		team_members: 15,
	},
};

export default planIntegers;
