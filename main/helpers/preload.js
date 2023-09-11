const { ipcRenderer } = require("electron");

process.once("loaded", () => {
  window.addEventListener("message", (evt) => {
    if (evt.data.type === "select-dirs") {
      ipcRenderer.send("select-dirs");
    }
  });
});
