//array of random colours in chakra ui format
const colors = ["blue", "yellow", "cyan", "pink"];

const randomColorString = () => {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

export default randomColorString;
