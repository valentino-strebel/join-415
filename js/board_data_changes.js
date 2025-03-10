/**
 * Calculates the progress of subtasks.
 *
 * @param {Array} cardSubtasks - The list of subtasks to evaluate.
 * @returns {Object} - An object containing the total and checked subtask count.
 */
function calcProgressSubtask(cardSubtasks) {
  let totalQuantity = cardSubtasks.length;
  let checkedQuantity = cardSubtasks.filter((task) => task.checked === 1).length;

  return {
    totalQuantity,
    checkedQuantity,
  };
}

/**
 * Clears the content of all board columns.
 */
function clearTasksContent() {
  document.getElementById("board_todo").innerHTML = "";
  document.getElementById("board_progress").innerHTML = "";
  document.getElementById("board_feedback").innerHTML = "";
  document.getElementById("board_done").innerHTML = "";
}
/**
 * Checks if a column is empty and updates its content accordingly.
 *
 * @param {string} columnId - The ID of the column to check.
 */
function checkColumnEmpty(columnId) {
  let container = document.getElementById(`board_${columnId}`);
  let noTaskElement = container.querySelector(`#no-task-message-${columnId}`);
  let columnNames = {
    todo: "To Do",
    progress: "Progress",
    feedback: "Await Feedback",
    done: "Done",
  };

  if (container.children.length === 0) {
    container.innerHTML = noTaskMessage(columnNames[columnId], columnId);
  } else {
    if (noTaskElement) {
      noTaskElement.remove();
    }
  }
}

/**
 * Adjusts the position of the search container based on screen width.
 */
function adjustSearchContainerPosition() {
  let searchContainer = document.getElementById("board-search-container");
  let boardHeader = document.querySelector(".board-header");
  let searchContainerParent = document.querySelector(".board-search-add-container");

  if (window.innerWidth <= 960) {
    if (!searchContainer.classList.contains("search-container-moved")) {
      searchContainer.classList.add("search-container-moved");
      boardHeader.insertAdjacentElement("afterend", searchContainer);
    }
  } else {
    if (searchContainer.classList.contains("search-container-moved")) {
      searchContainer.classList.remove("search-container-moved");
      searchContainerParent.appendChild(searchContainer);
    }
  }
}

/**
 * Opens the user story window by making it visible.
 */
function openUserStory() {
  let window = document.getElementById("taskDetailsWindow");
  let overlay = document.getElementById("overlayTasksDetail");

  if (window) window.classList.remove("d_none");
  if (overlay) overlay.classList.remove("d_none");

  setTimeout(() => {
    toggleStyleChange("taskDetailsWindow", "addContactWindowClosed", "addContactWindow");
  }, 100);
}

/**
 * Closes the user story window by hiding it.
 */
function closeUserStory() {
  let window = document.getElementById("taskDetailsWindow");
  let overlay = document.getElementById("overlayTasksDetail");

  contactNoAction("taskDetailsWindow", "addContactWindowClosed", "addContactWindow", "addContactWindowNoAction");

  setTimeout(() => {
    if (window) window.classList.add("d_none");
    if (overlay) overlay.classList.add("d_none");
  }, 100);
}
