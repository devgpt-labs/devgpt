const IGNORED_FILES_AND_FOLDERS = [
    ".ico",
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
    ".yaml",
    ".json",
    ".env",
    ".lock", //lock files should be ommited
    ".sll",
    "node_modules",
    "node-modules",
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

module.exports = IGNORED_FILES_AND_FOLDERS;
