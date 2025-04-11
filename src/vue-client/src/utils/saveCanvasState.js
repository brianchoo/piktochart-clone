const saveCanvasState = (canvasItems) => {
  if (canvasItems) {
    localStorage.setItem("canvasState", JSON.stringify(canvasItems.value));
  }
};

export { saveCanvasState };
