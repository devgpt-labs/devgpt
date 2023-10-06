const createModelID = (repo: string, owner: string, branch: string) => {
  return `${repo}-${owner}-${branch}`;
};

export default createModelID;
