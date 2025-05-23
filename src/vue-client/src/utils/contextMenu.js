let contextMenu = null;

const createContextMenu = () => {
  // Create the menu if it doesn't exist
  if (!contextMenu) {
    contextMenu = document.createElement("div");
    contextMenu.style.position = "absolute";
    contextMenu.style.backgroundColor = "white";
    contextMenu.style.border = "1px solid #ccc";
    contextMenu.style.boxShadow = "2px 2px 5px rgba(0,0,0,0.2)";
    contextMenu.style.padding = "5px";
    contextMenu.style.zIndex = "2000";
    contextMenu.style.display = "none";

    // Add delete option
    const deleteOption = document.createElement("div");
    deleteOption.textContent = "Delete";
    deleteOption.style.padding = "8px 12px";
    deleteOption.style.cursor = "pointer";
    deleteOption.style.borderRadius = "4px";

    // Hover effect
    deleteOption.addEventListener("mouseover", () => {
      deleteOption.style.backgroundColor = "#f0f0f0";
    });
    deleteOption.addEventListener("mouseout", () => {
      deleteOption.style.backgroundColor = "transparent";
    });

    // We'll set the click handler for delete separately
    contextMenu.appendChild(deleteOption);
    document.body.appendChild(contextMenu);
  }

  return contextMenu;
};

const hideContextMenu = () => {
  if (contextMenu) {
    contextMenu.style.display = "none";
  }
};

// Function to show context menu
const showContextMenu = (x, y, activeEl) => {
  const menu = createContextMenu();
  menu.style.display = "block";
  menu.style.left = `${x}px`;
  menu.style.top = `${y}px`;

  // Update the delete action with the current activeEl
  const deleteOption = menu.querySelector("div"); // Get the delete option

  // Remove any existing click listeners to avoid duplicates
  const newDeleteOption = deleteOption.cloneNode(true);
  deleteOption.parentNode.replaceChild(newDeleteOption, deleteOption);

  // Add the new click handler with current activeEl
  newDeleteOption.addEventListener("click", () => {
    if (activeEl) {
      activeEl.remove();
      const storedItems = JSON.parse(
        localStorage.getItem("canvasState") || "[]"
      );
      const updatedStoredItems = storedItems.filter(
        (item) => item.id.toString() !== activeEl.id
      );
      localStorage.setItem("canvasState", JSON.stringify(updatedStoredItems));
    }
    hideContextMenu();
  });

  // Close menu when clicking elsewhere
  setTimeout(() => {
    window.addEventListener("click", hideContextMenu, { once: true });
  }, 0);
};

export { showContextMenu };
