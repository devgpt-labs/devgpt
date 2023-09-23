const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    alert(err);
    return
  }
};

export default copyToClipboard;
