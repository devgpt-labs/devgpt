const escapeJSONString = (str: string) => {
  return str.replace(/"/g, '\\"'); // escape double quotes
};

export default escapeJSONString;
