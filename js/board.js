let assignedContacts = [];

/**
 * Renders tasks on the board and updates their statuses.
 * Clears the board and iterates through all tasks, placing them in the correct column.
 */
async function renderTasks() {
  let todo = document.getElementById("board_todo");
  let progress = document.getElementById("board_progress");
  let feedback = document.getElementById("board_feedback");
  let done = document.getElementById("board_done");
  clearTasksContent();
  for (let i = 0; i < tasks.length; i++) {
    let task = tasks[i];
    let taskElement = document.createElement("div");
    taskElement.innerHTML = listTasks(task, i, formatCategoryText(task.category));
    taskElement = taskElement.firstElementChild;
    renderTasksStatus(todo, progress, feedback, done, task, taskElement);
    getAssignedContacts(task.assigned, i);
    renderProgressbarSubtask(task.subtasks, i);
  }
  collectiveColumnEmpty();
}

/**
 * Checks if columns are empty and updates their visibility accordingly.
 */
function collectiveColumnEmpty() {
  checkColumnEmpty("todo");
  checkColumnEmpty("progress");
  checkColumnEmpty("feedback");
  checkColumnEmpty("done");
}

/**
 * Appends tasks to the respective columns based on their status.
 * @param {HTMLElement} todo - The "To Do" column element.
 * @param {HTMLElement} progress - The "In Progress" column element.
 * @param {HTMLElement} feedback - The "Await Feedback" column element.
 * @param {HTMLElement} done - The "Done" column element.
 * @param {Object} task - The task object.
 * @param {HTMLElement} taskElement - The generated task element.
 */
function renderTasksStatus(todo, progress, feedback, done, task, taskElement) {
  switch (task.status) {
    case "todo":
      todo.appendChild(taskElement);
      break;
    case "progress":
      progress.appendChild(taskElement);
      break;
    case "feedback":
      feedback.appendChild(taskElement);
      break;
    case "done":
      done.appendChild(taskElement);
      break;
    default:
      console.warn("Unbekannter Status:", task.status);
  }
}

/**
 * Retrieves assigned contacts for a task and updates the container.
 * @param {Array} contactIDs - Array of contact IDs assigned to the task.
 * @param {number} index - Index of the task.
 */
function getAssignedContacts(contactIDs, index) {
  assignedContacts = [];

  let content = document.getElementById("cardContact-" + index);
  content.innerHTML = "";
  //let maxContactsToShow = 5;
  let totalContacts = contactIDs.length;
  assignAvailableContacts(contactIDs, index, content);
  //insertMaximumContacts(totalContacts, maxContactsToShow, content);
  setContainerWidth(assignedContacts, content);
}
/**
 * Assigns available contacts to a given task and updates the provided content element.
 *
 * @param {number} totalContacts - Total number of contacts assigned to the task.
 * @param {number} maxContactsToShow - Maximum number of contacts to display.
 * @param {number} index - Index of the task in the tasks array.
 * @param {HTMLElement} content - The HTML element where the contacts will be displayed.
 */
function assignAvailableContacts(contactIDs, index, content) {
  for (let indexMy = 0; indexMy < contactIDs.length; indexMy++) {
    let contactIdentifier = tasks[index].assigned[indexMy].mainContactId;
    let contactIndex = contacts.findIndex((contact) => contact.id === contactIdentifier);
    if (contactIndex !== -1) {
      let assignedCode = contacts[contactIndex].colorId;
      let assignedName = contacts[contactIndex].name;

      content.innerHTML += listCardContacts(assignedName, assignedCode);
      assignedContacts.push(contacts[contactIndex]);
    }
  }
}

/**
 * Inserts an indicator showing the number of additional contacts beyond the displayed limit.
 *
 * @param {number} totalContacts - Total number of contacts assigned to the task.
 * @param {number} maxContactsToShow - Maximum number of contacts to display.
 * @param {HTMLElement} content - The HTML element where the indicator will be added.
 */
function insertMaximumContacts(totalContacts, maxContactsToShow, content) {
  if (totalContacts > maxContactsToShow) {
    let remainingContacts = totalContacts - maxContactsToShow;
    let moreContactsDiv = `<div class="more-contacts">+${remainingContacts}</div>`;
    content.innerHTML += moreContactsDiv;
  }
}

/**
 * Sets the width of the container based on the number of assigned contacts.
 *
 * @param {Array} assignedContacts - Array of assigned contact objects.
 * @param {HTMLElement} content - The HTML element whose width needs to be adjusted.
 */
function setContainerWidth(assignedContacts, content) {
  let widthContainer = assignedContacts.length === 1 ? 32 : (assignedContacts.length - 1) * 32;
  content.style.width = widthContainer + "px";
}

/**
 * Formats category text by trimming and removing the last word, then converting to lowercase.
 *
 * @param {string} category - The category string to format.
 * @returns {string} - The formatted category text.
 */
function formatCategoryText(category) {
  let formatCategory = category.trim().split(" ");
  formatCategory.pop().toLowerCase();
  let formattedText = formatCategory.join(" ").toLowerCase();
  return formattedText;
}

/**
 * Truncates text to a maximum of 48 characters, adding ellipsis if necessary.
 *
 * @param {string} text - The text to truncate.
 * @returns {string} - The truncated text with ellipsis if needed.
 */
function truncateText(text) {
  return text.length > 48 ? text.substring(0, 48) + "..." : text;
}

/**
 * Filters tasks based on search input and updates the board.
 * Shows a message if no tasks match the search criteria.
 */
function searchTasks() {
  let searchInput = document.querySelector("#board-search-container input").value.trim().toLowerCase();
  let taskContainers = document.querySelectorAll(".board-card");
  let noResultsMessage = document.getElementById("no-results-message");
  let foundTasks = createTaskContainers(searchInput, taskContainers);
  noResultsMessage.style.display = foundTasks ? "none" : "block";
}
/**
 * Filters and displays task containers based on search input.
 * @param {string} searchInput - The search query input.
 * @param {NodeList} taskContainers - List of task elements to filter.
 * @returns {boolean} - Returns true if any task matches the search, otherwise false.
 */
function createTaskContainers(searchInput, taskContainers) {
  let foundTasks = false;
  taskContainers.forEach((task) => {
    let title = task.querySelector(".card-title-discription p.weight700")?.innerText.trim().toLowerCase();
    let description = task.querySelector(".card-title-discription p.weight400")?.innerText.trim().toLowerCase();
    if (searchInput === "" || (title && title.startsWith(searchInput)) || (description && description.startsWith(searchInput))) {
      task.style.display = "flex";
      foundTasks = true;
    } else {
      task.style.display = "none";
    }
  });
  return foundTasks;
}

/**
 * Handles the drop event to move a task to a different column.
 * @param {DragEvent} ev - The drag event.
 * @param {string} targetColumn - The target column identifier where the task is dropped.
 */
async function drop(ev, targetColumn) {
  ev.preventDefault();
  removeHighlight(targetColumn);
  let taskId = ev.dataTransfer.getData("text");
  let draggedElement = document.getElementById(taskId);
  let dropTarget = document.getElementById("board_" + targetColumn);
  if (dropTarget && draggedElement) {
    dropTarget.appendChild(draggedElement);
    let dropTargetId = dropTarget.id;
    let task = tasks.find((t) => t.id === taskId);
    if (task) {
      let previousStatus = task.status;
      task.status = dropTargetId.replace("board_", "");
      try {
        await updateTaskStatusInFirebase(taskId, task.status);
      } catch (error) {
        console.error("Error updating task status in Firebase:", error);
      }
      checkColumnEmpty(previousStatus);
      checkColumnEmpty(task.status);
    }
  }
}

/**
 * Updates the task status in Firebase.
 * @param {string} taskId - The ID of the task.
 * @param {string} newStatus - The new status of the task.
 * @throws Will throw an error if updating the task status fails.
 */
async function updateTaskStatusInFirebase(taskId, newStatus) {
  try {
    await taskStatusTry(taskId, newStatus);
  } catch (error) {
    console.error("Error updating task status in Firebase:", error);
    throw error;
  }
}

/**
 * Sends a request to Firebase to update the task status.
 * @param {string} taskId - The ID of the task.
 * @param {string} newStatus - The new status to be updated.
 * @throws Will throw an error if the request fails.
 */
async function taskStatusTry(taskId, newStatus) {
  const getResponse = await fetch(`${BASE_URL}tasks/${taskId}.json`);
  const existingData = await getResponse.json();
  existingData.status = newStatus;
  const response = await fetch(`${BASE_URL}tasks/${taskId}.json`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(existingData),
  });
  if (!response.ok) {
    throw new Error(`Error updating task: ${response.statusText}`);
  }
}

/**
 * Allows an element to be dropped by preventing default behavior.
 * @param {DragEvent} ev - The drag event.
 */
function allowDrop(ev) {
  ev.preventDefault();
}

/**
 * Handles the drag event by storing the dragged element's ID.
 * @param {DragEvent} ev - The drag event.
 */
function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

/**
 * Adds a CSS class to highlight the specified column.
 * @param {string} columnId - Example: 'todo', 'progress', 'feedback', 'done'
 */
function highlight(columnId) {
  const column = document.getElementById("board_" + columnId);
  if (column) {
    column.classList.add("board-card-container-highlight");
  }
}
/**
 * Removes the highlight CSS class from the specified column.
 * @param {string} columnId - Example: 'todo', 'progress', 'feedback', 'done'
 */
function removeHighlight(columnId) {
  const column = document.getElementById("board_" + columnId);
  if (column) {
    column.classList.remove("board-card-container-highlight");
  }
}

/**
 * Displays the "No tasks" message if a column is empty.
 * @param {string} id - The ID of the board column.
 */
function showNoTask(id) {
  let container = document.getElementById(`board_${id}`);
  let content = document.getElementById(`no-task-${id}`);
  if ((container.children.length = 1)) {
    content.style.display = "flex";
  }
}
/**
 * Opens the "Add Task" overlay and hides the left navbar.
 */
function openAddTaskOverlay(status) {
  document.getElementById("addTaskOverlay").classList.remove("d_none");
  setButtonColor("Medium", "#FFA800");

  taskStatus = status;
}
/**
 * Closes the "Add Task" overlay and makes the left navbar visible again.
 */
function closeAddTaskOverlay() {
  resetAllInputs();
  document.getElementById("addTaskOverlay").classList.add("d_none");
}

/**
 * Event listener for search input
 */
document.addEventListener("DOMContentLoaded", () => {
  let searchInput = document.querySelector("#board-search-container input");
  let boardWrapper = document.querySelector(".board-wrapper");

  if (searchInput) {
    searchInput.addEventListener("input", searchTasks);

    let noResultsMessage = document.createElement("div");
    noResultsMessage.id = "no-results-message";
    noResultsMessage.innerText = "No results found.";
    boardWrapper.insertBefore(noResultsMessage, boardWrapper.firstChild);
  }
});
/**
 * Renders the progress bar for subtasks within a card.
 *
 * @param {Array} cardSubtasks - The list of subtasks associated with the card.
 * @param {number} index - The index of the card to update the progress bar.
 */
function renderProgressbarSubtask(cardSubtasks, index) {
  let statusContainer = document.getElementById("subtaskStatus-" + index);
  let progress = document.getElementById("subtaskProgress-" + index);
  let tasksDone = document.getElementById("subtaskDone-" + index);

  if (!cardSubtasks || cardSubtasks.length === 0) {
    statusContainer.style.display = "none";
    return;
  }

  let progressData = calcProgressSubtask(cardSubtasks);
  let percentage = (progressData.checkedQuantity / progressData.totalQuantity) * 100;

  progress.style.width = percentage + "%";
  tasksDone.innerHTML = progressData.checkedQuantity + "/" + progressData.totalQuantity + " Subtasks";
}

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
