const recreateCanvasFromState = (
  canvasItems,
  activeElement,
  makeElementDraggable,
  handleCanvasClick
) => {
  const block = document.querySelector(".block");
  if (!block) return;

  // Clear existing elements
  block.innerHTML = "";

  // Recreate each element from state
  canvasItems.value.forEach((item) => {
    let element;

    if (item.type === "image") {
      element = document.createElement("img");
      element.src = item.src;
    } else if (item.type === "text") {
      element = document.createElement("p");
      element.textContent = item.content;
    }

    if (element) {
      element.id = item.id;
      element.dataset.type = item.type;
      element.style.position = "absolute";
      element.style.left = `${item.x}px`;
      element.style.top = `${item.y}px`;
      element.style.zIndex = item.zIndex;

      const positionLeft = element.style.left;
      const positionTop = element.style.top;

      makeElementDraggable(
        element,
        block,
        activeElement,
        positionLeft,
        positionTop
      );
      block.appendChild(element);
    }
  });

  // Add click handler to the canvas for deselection
  if (!block.hasClickListener) {
    block.addEventListener("click", handleCanvasClick);
    block.hasClickListener = true;
  }
};

export { recreateCanvasFromState };
