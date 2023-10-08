const stringifyJsonClean = (obj: any): string => {
  return JSON.stringify(obj, (key, value) => {
    if (value === null || value === undefined) {
      return undefined;
    }
    return value;
  });
};

export default stringifyJsonClean;
