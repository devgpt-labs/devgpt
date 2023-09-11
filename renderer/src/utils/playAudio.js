

const playAudio = (url, volume) => {
  const audio = new Audio(
    url
  );

  audio.volume = volume;
  audio.play();
};

export default playAudio;
