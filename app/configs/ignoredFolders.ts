

const IGNORED_FOLDERS = [
	"node_modules",
	".git", // Git metadata folder
	".vscode", // Visual Studio Code settings folder
	".idea", // JetBrains IntelliJ IDEA settings folder
	".venv", // Python virtual environment folder
	"venv", // Alternative Python virtual environment folder
	"build", // Build output folder
	"dist", // Distribution folder
	"out", // Output folder
	"target", // Java/Maven target folder
	"bin", // Binary folder
	"obj", // Object folder (C#/.NET)
	"vendor" // PhP Eqv of node_modules
];
export default IGNORED_FOLDERS;
