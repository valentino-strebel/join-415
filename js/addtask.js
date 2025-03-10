/**
 * Represents the status of a task.
 * @type {string}
 */
let taskStatus = "todo";

/**
 * Represents the selected priority.
 * @type {undefined|string}
 */
let selectedPrio = undefined;

/**
 * Gets the current date in YYYY-MM-DD format.
 * @type {string}
 */
let todayDate = new Date().toJSON().slice(0, 10);

/**
 * Generates HTML for contacts list.
 * @param {Array<Object>} contacts - Array of contact objects.
 * @returns {string} - HTML string for contacts.
 */
function generateContactsHTML(contacts) {
  return contacts
    .map((contact) =>
      listContactsAddtask(
        contact.id,
        contact.name,
        contact.colorId,
        currentUser
      )
    )
    .join("");
}

/**
 * Renders the contacts in the UI.
 * @async
 * @param {Array<Object>} [filteredContacts=contacts] - Array of filtered contacts.
 * @returns {Promise<void>}
 */
async function renderContacts(filteredContacts = contacts) {
  let sortedContacts = await sortContacts(filteredContacts);
  let list = document.getElementById("contacts-checkbox");
  list.innerHTML = generateContactsHTML(sortedContacts);

  selectedContactsIDs.forEach((selected) => {
    let checkbox = document.getElementById(`checkbox-${selected.id}`);
    if (checkbox) {
      checkbox.checked = true;
    }
  });
}

/**
 * Filters contacts based on search input.
 * @param {string} contactsCheck - The ID of the input element used for searching.
 */
function filterContacts(contactsCheck) {
  let searchTerm = document.getElementById(contactsCheck).value.toLowerCase();
  let filteredContacts = searchTerm
    ? contacts.filter((contact) =>
        contact.name.toLowerCase().startsWith(searchTerm)
      )
    : contacts;
  renderContacts(filteredContacts);
}

/**
 * Toggles a contact's selection status.
 * @param {number|string} id - The ID of the contact.
 */
function toggleCheckbox(id, selectId) {
  focusDiv(selectId);
  if (selectedContactsIDs.some((obj) => obj.id === id)) {
    selectedContactsIDs = selectedContactsIDs.filter((obj) => obj.id !== id);
  } else {
    selectedContactsIDs.push({ id: id });
  }
  renderAssignedContacts(id);
}

/**
 * Toggles the state of a checkbox and calls toggleCheckbox function.
 * @param {string} id - The identifier for the checkbox.
 */
function setCheckbox(id) {
  let checkbox = document.getElementById(`checkbox-${id}`);
  if (checkbox) {
    checkbox.checked = !checkbox.checked;
  }
  toggleCheckbox(id);
}

/**
 * Render assigned contacts in the UI.
 * 
 * This function filters the selected contacts, limits the displayed contacts to a maximum of 5,
 * and displays a "+X" indicator if there are more contacts than the allowed limit.
 * 
 * @function
 */
function renderAssignedContacts() {
  let contactInfo = contacts.filter((contact) =>
    selectedContactsIDs.some((selected) => selected.id === contact.id)
  );
  let content = document.getElementById("assignedContacts");
  content.innerHTML = "";
  let maxContactsToShow = 5;
  let displayedContacts = contactInfo.slice(0, maxContactsToShow);

  displayedContacts.forEach((contact) => {
    content.innerHTML += listAssingedContacts(contact.name, contact.colorId);
  });
  if (contactInfo.length > maxContactsToShow) {
    let remainingContacts = contactInfo.length - maxContactsToShow;
    content.innerHTML += `<div class="more-contacts">+${remainingContacts}</div>`;
  }
}


/**
 * Sets the background color of a selected button and resets other buttons.
 * @param {string} selectedButton - The ID of the selected button.
 * @param {string} colorCode - The color code to set as the background color.
 */
function setButtonColor(selectedButton, colorCode) {
  resetButtonColors();
  let activeButton = document.getElementById(`button${selectedButton}`);
  if (!activeButton) return;
  let img = activeButton.querySelector("img");
  if (!img) return;
  activeButton.style.backgroundColor = colorCode;
  activeButton.style.color = "#FFFFFF";
  img.style.filter =
    "brightness(0) saturate(100%) invert(93%) sepia(100%) saturate(0%) hue-rotate(141deg) brightness(104%) contrast(101%)";
  selectedPrio = selectedButton.toLowerCase();
}

/**
 * Resets the background color and styles of all buttons that match the pattern "button*".
 */
function resetButtonColors() {
  let buttons = document.querySelectorAll("[id^='button']");
  buttons.forEach((button) => {
    button.style.backgroundColor = "rgba(255, 255, 255, 1)";
    button.style.color = "rgba(0, 0, 0, 1)";
    let img = button.querySelector("img");
    if (img) {
      img.style.filter = "none";
    }
  });
}

/**
 * Focuses and selects the text inside an input field.
 * @param {string} inputId - The ID of the input field.
 * @param {string} add - The ID of the add icon.
 * @param {string} check - The ID of the check icon.
 */
function selectInput(inputId, add, check) {
  showButtons(add, check);
  let input = document.getElementById(inputId);
  input.focus();
  input.select();
}

/**
 * Shows specific buttons when an input is selected.
 * @param {string} add - The ID of the add icon.
 * @param {string} check - The ID of the check icon.
 */
function showButtons(add, check) {
  let checkCross = document.getElementById(check);
  let addIcon = document.getElementById(add);
  checkCross.style.display = "flex";
  addIcon.style.display = "none";
}

/**
 * Hides the buttons after an input loses focus and clears its value.
 * @param {string} inputId - The ID of the input field.
 * @param {string} cross - The ID of the cross icon.
 * @param {string} add - The ID of the add icon.
 */
function hideButtons(inputId, cross, add) {
  let input = document.getElementById(inputId);
  let checkCross = document.getElementById(cross);
  let addIcon = document.getElementById(add);
  setTimeout(() => {
    checkCross.style.display = "none";
    addIcon.style.display = "flex";
    input.blur();
    input.value = "";
  }, 150);
}

/**
 * Clears the input field and sets focus to it.
 */
function clearInput() {
  let content = document.getElementById("subtaskInput");
  content.value = "";
  content.focus();
  content.select();
}

/**
 * Adds a new subtask to the subtaskInputs array if input is not empty.
 * Clears the input field and re-renders the subtask list.
 */
function confirmInput() {
  let input = document.getElementById("subtaskInput");
  if (input.value.trim() !== "") {
    subtaskInputs.push({
      text: input.value.trim(),
      checked: 0,
    });
    renderSubtasks();
    clearInput();
  }
}

/**
 * Renders the list of subtasks dynamically in the DOM.
 * Iterates over subtaskInputs and updates the list element.
 */
function renderSubtasks() {
  let list = document.getElementById("subtaskList");
  list.innerHTML = "";
  for (let i = 0; i < subtaskInputs.length; i++) {
    let content = subtaskInputs[i].text;
    list.innerHTML += listSubtasks(i, content);
  }
}

/**
 * Enables editing mode for a specific subtask.
 * @param {number} index - Index of the subtask to be edited.
 */
function editListItem(index) {
  let listItem = document.getElementById(`listItem-${index}`);
  let editIcon = document.getElementById(`editIcon-${index}`);
  let checkIcon = document.getElementById(`checkIcon-${index}`);
  let listItemContainer = document.getElementById(
    `list-item-container-${index}`
  );

  listItem.setAttribute("contenteditable", "true");
  listItemContainer.classList.toggle("edit-subtask");
  listItem.focus();
  editIcon.style.display = "none";
  checkIcon.style.display = "block";
}

/**
 * Updates the subtask text after editing and re-renders the list.
 * If the text is empty, the subtask is deleted.
 * @param {number} index - Index of the subtask being updated.
 */
function updateListItem(index) {
  let listItem = document.getElementById(`listItem-${index}`);
  let editIcon = document.getElementById(`editIcon-${index}`);
  let checkIcon = document.getElementById(`checkIcon-${index}`);

  subtaskInputs[index].text = listItem.innerText.trim();
  listItem.setAttribute("contenteditable", "false");

  if (listItem.innerText.length === 0) {
    deleteListItem(index);
  }

  editIcon.style.display = "block";
  checkIcon.style.display = "none";
  renderSubtasks();
}

/**
 * Handles Enter key press event to save subtask updates.
 * @param {KeyboardEvent} event - The keypress event.
 * @param {number} index - Index of the subtask being edited.
 */
function handleEnter(event, index) {
  if (event.key === "Enter") {
    event.preventDefault();
    updateListItem(index);
  }
}

/**
 * Deletes a subtask from the subtaskInputs array and re-renders the list.
 * @param {number} index - Index of the subtask to be deleted.
 */
function deleteListItem(index) {
  subtaskInputs.splice(index, 1);
  renderSubtasks();
}

/**
 * Clears all input fields in the Add Task form.
 */
async function resetAllInputs() {
  document.getElementById("taskTitle").value = "";
  document.getElementById("taskDescription").value = "";
  document.getElementById("contacts-search").value = "";
  document.getElementById("date").value = "";
  document.getElementById("inputCategory").selectedIndex = 0;
  document.getElementById("subtaskInput").value = "";
  resetButtonColors();
  setButtonColor("Medium", "#FFA800");
  await resetCheckboxAssignee();
  await resetCheckboxFocus();
  selectedPrio = "";
  subtaskInputs = [];
  selectedContactsIDs = [];
  renderAssignedContacts();
  renderSubtasks();
}

/**
 * Resets all checkboxes assigned to selected contacts.
 * @async
 * @returns {Promise<void>}
 */
async function resetCheckboxAssignee() {
  for (let index = 0; index < selectedContactsIDs.length; index++) {
    let id = selectedContactsIDs[index].id;
    let chekboxCheck = document.getElementById("checkbox-" + id);
    if (chekboxCheck) {
      chekboxCheck.checked = false;
    }
  }
}

/**
 * Removes focus highlighting from all selected contact elements.
 * @async
 * @returns {Promise<void>}
 */
async function resetCheckboxFocus() {
  for (let index = 0; index < selectedContactsIDs.length; index++) {
    let id = selectedContactsIDs[index].id;
    let focusedDivs = document.getElementById("focus-" + id);
    if (focusedDivs) {
      focusedDivs.classList.remove("divFocus");
    }
  }
}

/**
 * Retrieves task data, validates it, and updates the database.
 * If successful, resets inputs and navigates to the board page.
 * @async
 * @returns {Promise<void>}
 */
async function getTaskData() {
  if (validateData()) {
    let data = prepareTaskData();
    try {
      await update_data("tasks", data);
      resetAllInputs();
      window.location.href = `../html/board.html`;
    } catch (error) {
      console.error("Error saving task:", error);
    }
  } else {
    return;
  }
}

/**
 * Prepares task data by gathering input values.
 * @returns {Object} Task data object.
 */
function prepareTaskData() {
  return {
    title: document.getElementById("taskTitle").value,
    description: document.getElementById("taskDescription").value,
    contact: selectedContactsIDs,
    date: document.getElementById("date").value,
    prio: selectedPrio,
    category: document.getElementById("inputCategory").value,
    subtask: subtaskInputs,
    status: stautsEmpty(taskStatus),
  };
}

/**
 * Returns a default status if the status is empty.
 * @param {string} stauts - The current status of the task.
 * @returns {string} The determined task status.
 */
function stautsEmpty(stauts) {
  if (!stauts) {
    return (taskStatus = "todo");
  }
  return taskStatus;
}

/**
 * Displays an error message for the given input element.
 * @param {HTMLElement} element - The input element where the error occurred.
 * @param {string} message - The error message to display.
 * @returns {boolean} False if an error is displayed, true otherwise.
 */
function showError(element, message) {
  let parent =
    element.closest(".add-task-input-fields") ||
    element.closest(".add-task-prio");
  let errorSpan = parent.querySelector(".error-text");
  if (errorSpan) {
    errorSpan.remove();
  }
  if (message) {
    let errorMessage = document.createElement("span");
    errorMessage.textContent = message;
    errorMessage.classList.add("error-text");
    parent.appendChild(errorMessage);
    element.focus();
    return false;
  }
  return true;
}
