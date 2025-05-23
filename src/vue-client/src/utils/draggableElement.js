import { showContextMenu } from "@/utils/contextMenu";

// Function to handle click on elements (setting active state)
const handleElementClick = (element, e, activeElement) => {
  // Remove active state from previous element
  if (activeElement.value) {
    activeElement.value.style.border = "none";
    activeElement.value.style.boxShadow = "none";
  }

  // Set new active element
  activeElement.value = element;
  activeElement.value.style.border = "4px solid blue";
  activeElement.value.style.boxShadow = "0 0 10px rgba(0, 123, 255, 0.8)";

  // Stop event propagation
  e.stopPropagation();
};

// Function to handle right-click on elements
const handleElementRightClick = (e, activeElement) => {
  if (activeElement.value) {
    e.preventDefault();
    showContextMenu(e.clientX, e.clientY, activeElement.value);
  }
};

const makeElementDraggable = (
  element,
  elementBlock,
  activeElement,
  positionLeft,
  positionTop
) => {
  let currentX;
  let currentY;
  element.style.position = "absolute";
  element.style.width = "100px";
  element.style.height = "100px";
  element.style.margin = "10px";
  element.style.left = positionLeft || "50%";
  element.style.top = positionTop || "50%";
  element.style.transform = "translate(-50%, -50%)";
  element.style.cursor = "move"; // Change cursor to indicate draggable

  // Make the image draggable
  element.setAttribute("draggable", "false"); // Prevent default HTML5 dragging behavior

  // Variables to track dragging
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  // Add click event to set active state
  element.addEventListener("click", (e) =>
    handleElementClick(element, e, activeElement)
  );

  // Add right-click event for context menu
  element.addEventListener("contextmenu", (e) => {
    handleElementRightClick(e, activeElement);
  });

  // Mouse down event - start dragging
  element.addEventListener("mousedown", (e) => {
    isDragging = true;

    // Calculate offset from the center of the image
    const rect = element.getBoundingClientRect();
    offsetX = e.clientX - (rect.left + rect.width / 2 - 50);
    offsetY = e.clientY - (rect.top + rect.height / 2 - 50);

    // Bring element to front when dragging starts
    element.style.zIndex = 1000;

    // Prevent any default behavior
    e.preventDefault();
  });

  // Mouse move event - handle dragging
  document.addEventListener("mousemove", (e) => {
    if (!isDragging) {
      element.style.border = "none";
      return;
    }

    // Calculate new position relative to the canvas
    const blockRect = elementBlock.getBoundingClientRect();
    const newX = e.clientX - blockRect.left - offsetX;
    const newY = e.clientY - blockRect.top - offsetY;
    currentX = newX;
    currentY = newY;

    // Update position
    element.style.left = newX + "px";
    element.style.top = newY + "px";
    element.style.transform = "none";
    element.style.border = "1px solid red";

    e.preventDefault();
  });

  // Mouse up event - stop dragging
  document.addEventListener("mouseup", () => {
    if (isDragging) {
      isDragging = false;
      element.style.zIndex = "auto"; // Reset z-index

      const localStorageItems = JSON.parse(
        localStorage.getItem("canvasState" || [])
      );

      const updatedItems = localStorageItems.map((item) => {
        if (item.id.toString() === element.id) {
          return { ...item, x: currentX, y: currentY };
        }
        return item;
      });

      localStorage.setItem("canvasState", JSON.stringify(updatedItems));
    }
  });

  // Mouse leave - stop dragging if cursor leaves the window
  document.addEventListener("mouseleave", () => {
    isDragging = false;
  });
};

export { makeElementDraggable };
