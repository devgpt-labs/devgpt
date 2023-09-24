const escapeJSONString = (str: string) => {
  return str.replace(/\\/g, "\\\\").replace(/"/g, '\\"'); // escape double quotes
};

export default escapeJSONString;
