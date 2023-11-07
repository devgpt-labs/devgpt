const checkCodeLanguage = (file: string) => {
  const fileType = file?.split(".")?.[1];

  switch (fileType) {
    case "javascript":
    case "js":
      return "javascript";
    case "typescript":
    case "ts":
      return "typescript";
    case "jsx":
      return "javascript";
    case "tsx":
      return "typescript";
    case "python":
    case "py":
      return "python";
    case "ruby":
    case "rb":
      return "ruby";
    case "csharp":
    case "cs":
      return "csharp";
    case "go":
      return "go";
    case "java":
      return "java";
    case "php":
      return "php";
    case "html":
      return "html";
    case "css":
      return "css";
    case "json":
      return "json";
    case "xml":
      return "xml";
    case "sql":
      return "sql";
    case "yaml":
      return "yaml";
    case "markdown":
    case "md":
      return "markdown";
    case "shell":
    case "sh":
      return "shell";
    case "cpp":
      return "cpp";
    case "c":
      return "c";
    case "swift":
      return "swift";
    case "rust":
      return "rust";
    case "kotlin":
      return "kotlin";
    default:
      return "javascript";
  }
};

export default checkCodeLanguage;
