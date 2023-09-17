const makeCodeParseable = (codeString) => {
  let parseable = String(codeString).trim();

  const firstBracketIndex = parseable.indexOf("[");
  const lastBracketIndex = parseable.lastIndexOf("]");

  if (
    firstBracketIndex === -1 ||
    lastBracketIndex === -1 ||
    firstBracketIndex > lastBracketIndex
  ) {
    return parseable;
  }

  return parseable.slice(firstBracketIndex, lastBracketIndex + 1);
};

export default makeCodeParseable;
