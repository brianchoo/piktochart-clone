import { randomNumberGenerator } from "@/helpers/randomNumberGenerator";
import { makeElementDraggable } from "@/utils/draggableElement";

const saveCanvasState = (canvasItems) => {
  if (canvasItems) {
    localStorage.setItem("canvasState", JSON.stringify(canvasItems.value));
  }
};

const addItemToCanvas = (itemConfig, canvasItems, activeElement) => {
  const { type, id, element, properties } = itemConfig;

  // Add to state array
  canvasItems.value.push({
    type,
    id,
    ...properties,
    x: 0, // Initial position
    y: 0,
    zIndex: canvasItems.value.length, // For layering
  });

  const block = document.querySelector(".block");

  // Apply any custom styling or attributes
  if (itemConfig.customizeElement) {
    itemConfig.customizeElement(element);
  }

  // Set element ID and make draggable
  element.id = id;
  makeElementDraggable(element, block, activeElement);
  block.appendChild(element);

  // Save state
  saveCanvasState(canvasItems);

  // Add click handler to the canvas for deselection (once)
  if (!block.hasClickListener) {
    block.addEventListener("click", handleCanvasClick);
    block.hasClickListener = true;
  }

  return element;
};

/**
 * Add an image to the canvas
 */
const addImageToCanvas = (imageUrl, canvasItems, activeElement) => {
  const imageId = randomNumberGenerator();
  const img = document.createElement("img");
  img.src = imageUrl;

  return addItemToCanvas(
    {
      type: "image",
      id: imageId,
      element: img,
      properties: { src: imageUrl },
    },
    canvasItems,
    activeElement
  );
};

/**
 * Add text to the canvas
 */
const addTextToCanvas = (canvasItems, activeElement) => {
  const textInput = document.getElementById("addTextInput");
  if (!textInput.value) return null;

  const textId = randomNumberGenerator();
  const p = document.createElement("p");
  p.textContent = textInput.value;

  const element = addItemToCanvas(
    {
      type: "text",
      id: textId,
      element: p,
      properties: { content: textInput.value },
    },
    canvasItems,
    activeElement
  );

  // Clear input after adding
  textInput.value = "";

  return element;
};

// Export all functions
export {
  addItemToCanvas,
  addImageToCanvas,
  addTextToCanvas,
  randomNumberGenerator,
};
