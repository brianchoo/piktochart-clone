import { saveCanvasState } from "@/utils/saveCanvasState";

const handleCanvasClick = (activeElement) => {
  if (activeElement.value) {
    activeElement.value.style.border = "none";
    activeElement.value.style.boxShadow = "none";
    activeElement.value = null;
  }
};

const handleKeyDown = (e, activeElement, canvasItems) => {
  if (e.key === "Delete" && activeElement.value) {
    const itemId = activeElement.value.id;
    canvasItems.value = canvasItems.value.filter(
      (item) => item.id.toString() !== itemId
    );
    activeElement.value.remove();
    activeElement.value = null;
    saveCanvasState(canvasItems);
  }
};

export { handleCanvasClick, handleKeyDown };
