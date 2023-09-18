

const checkOS = (macOption, winOptions) => {
  if(process.platform === 'darwin') {
    return macOption;
  } else if(process.platform === 'win32') {
    return winOptions;
  } else {
    return macOption;
  }
};

export default checkOS;
