const IGNORED_FILES = [
	".png",
	".svg",
	".jpg",
	".jpeg",
	".gif", // Image formats
	".pdf", // PDF files
	".docx", // Microsoft Word documents
	".doc", // Microsoft Word documents
	".xlsx", // Microsoft Excel spreadsheets
	".xls", // Microsoft Excel spreadsheets
	".pptx", // Microsoft PowerPoint presentations
	".ppt", // Microsoft PowerPoint presentations
	".zip", // Zip archives
	".tar", // Tar archives
	".gz", // Gzip compressed files
	".exe", // Executable files
	".dll", // Dynamic Link Libraries
	".so", // Shared Object files (Linux)
	".o", // Object files (compiled code)
	".a", // Archive files
	".class", // Java class files
	".jar", // Java Archive files
	".pdb", // Program Database files (debug info)
	".swp", // Vim swap files
	".gitignore", 
	".lock" //lock files should be ommited
];

export default IGNORED_FILES;