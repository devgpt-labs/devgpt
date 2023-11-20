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
    ".jar", // Java Archive files
    ".pdb", // Program Database files (debug info)
    ".swp", // Vim swap files
    ".gitignore",
    ".yaml",
    ".yml",
    ".json",
    ".env",
    ".lock", //lock files should be omitted
    ".sll",
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
    "vendor", // PHP Eqv of node_modules
    ".gem", // Gem files
    ".rbc", // Ruby compiled files
    ".rbo", // Ruby compiled files
    ".gemfile.lock", // Gemfile lock file
    ".ruby-version", // Ruby version file
    ".ruby-gemset", // Ruby gemset file
    ".rbenv-version", // rbenv version file
    ".rvmrc", // RVM version file
    "Gemfile.lock", // Gemfile lock file
    "vendor/bundle/", // Bundler's bundle directory
    "log/", // Log files
    "tmp/", // Temporary files
    "coverage/", // Code coverage reports
    "Rakefile", // Rake build script
    "Capfile", // Capistrano configuration file
    "config.ru", // Rackup configuration file
    ".rspec", // RSpec configuration file
    "spec/", // RSpec test directory
    "test/", // Test directory
    "Guardfile", // Guard configuration file
    ".yardoc/", // YARD documentation directory
    ".yardopts", // YARD documentation configuration file
    "fonts/",
    "images/",
    "img/",
    "assets/",
    "node-modules", // Missing in the second list
    ".class", // Missing in the second list
];

module.exports = IGNORED_FILES_AND_FOLDERS;
