const checkCodeLanguage = (file: string) => {
  const fileType = file.split(".")[1];

  switch (fileType) {
    case "js":
      return "javascript";
    case "ts":
      return "typescript";
    case "py":
      return "python";
    case "rb":
      return "ruby";
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
    case "md":
      return "markdown";
    case "sh":
      return "shell";
    default:
      return "javascript";
  }
}

export default checkCodeLanguage;