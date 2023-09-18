const chunkAndMapToLLMPromise = async (
  array: any,
  chunkSize: any,
  asyncHandler: any,
  maxChunks: any
) => {
  let chunkedLofaf = array.reduce((resultArray: any, item: any, index: any) => {
    const chunkIndex = Math.floor(index / chunkSize);

    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = []; // start a new chunk
    }

    resultArray[chunkIndex].push(item);

    return resultArray;
  }, []);

  // If maxChunks is defined, only process the first maxChunks chunks
  if (maxChunks) {
    chunkedLofaf = chunkedLofaf.slice(0, maxChunks);
  }

  const mapPromiseArray = async (arr: any) => {
    // Map each item to a promise
    const promises = arr.map(async (item: any) => {
      return asyncHandler(item);
    });

    // Wait for all promises to resolve
    const results = await Promise.all(promises);

    return results;
  };

  let processedLofaf = await mapPromiseArray(chunkedLofaf);

  return processedLofaf;
};

export default chunkAndMapToLLMPromise;
