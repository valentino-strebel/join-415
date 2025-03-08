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
  return contacts.map((contact) => listContactsAddtask(contact.id, contact.name, contact.colorId, currentUser)).join("");
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
  let filteredContacts = searchTerm ? contacts.filter((contact) => contact.name.toLowerCase().startsWith(searchTerm)) : contacts;
  renderContacts(filteredContacts);
}

/**
 * Toggles a contact's selection status.
 * @param {number|string} id - The ID of the contact.
 */
function toggleCheckbox(id) {
  if (selectedContactsIDs.some((obj) => obj.id === id)) {
    selectedContactsIDs = selectedContactsIDs.filter((obj) => obj.id !== id);
  } else {
    selectedContactsIDs.push({ id: id });
  }
  renderAssignedContacts(id);
}

function setCheckbox(id) {
  let checkbox = document.getElementById(`checkbox-${id}`);
  if (checkbox) {
    checkbox.checked = !checkbox.checked;
  }
  toggleCheckbox(id);
}

function renderAssignedContacts() {
  let contactInfo = contacts.filter((contact) => selectedContactsIDs.some((selected) => selected.id === contact.id));
  let content = document.getElementById("assignedContacts");
  content.innerHTML = contactInfo.map((contact) => listAssingedContacts(contact.name, contact.colorId)).join("");
}

function setButtonColor(selectedButton, colorCode) {
  resetButtonColors();
  let activeButton = document.getElementById(`button${selectedButton}`);
  if (!activeButton) return;
  let img = activeButton.querySelector("img");
  if (!img) return;
  activeButton.style.backgroundColor = colorCode;
  activeButton.style.color = "#FFFFFF";
  img.style.filter = "brightness(0) saturate(100%) invert(93%) sepia(100%) saturate(0%) hue-rotate(141deg) brightness(104%) contrast(101%)";
  selectedPrio = selectedButton.toLowerCase();
}

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

function selectInput(inputId, add, check) {
  showButtons(add, check);
  let input = document.getElementById(inputId);
  input.focus();
  input.select();
}

function showButtons(add, check) {
  let checkCross = document.getElementById(check);
  let addIcon = document.getElementById(add);
  checkCross.style.display = "flex";
  addIcon.style.display = "none";
}

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

function clearInput() {
  let content = document.getElementById("subtaskInput");
  content.value = "";
  content.focus();
  content.select();
}

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

function renderSubtasks() {
  let list = document.getElementById("subtaskList");
  list.innerHTML = "";
  for (let i = 0; i < subtaskInputs.length; i++) {
    let content = subtaskInputs[i].text;
    list.innerHTML += listSubtasks(i, content);
  }
}

function editListItem(index) {
  let listItem = document.getElementById(`listItem-${index}`);
  let lengthThis = listItem.value.length;
  let editIcon = document.getElementById(`editIcon-${index}`);
  let checkIcon = document.getElementById(`checkIcon-${index}`);
  let listItemContainer = document.getElementById(`list-item-container-${index}`);
  listItem.setAttribute("contenteditable", "true");
  listItemContainer.classList.toggle("edit-subtask");
  listItem.focus();
  editIcon.style.display = "none";
  checkIcon.style.display = "block";
}

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

function handleEnter(event, index) {
  if (event.key === "Enter") {
    event.preventDefault();
    updateListItem(index);
  }
}

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

async function resetCheckboxAssignee() {
  for (let index = 0; index < selectedContactsIDs.length; index++) {
    let id = selectedContactsIDs[index].id;
    let chekboxCheck = document.getElementById("checkbox-" + id);
    chekboxCheck.checked = false;
  }
}

async function resetCheckboxFocus() {
  for (let index = 0; index < selectedContactsIDs.length; index++) {
    let id = selectedContactsIDs[index].id;
    let focusedDivs = document.getElementById("focus-" + id);
    focusedDivs.classList.remove("divFocus");
  }
}

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

function prepareTaskData() {
  let title = document.getElementById("taskTitle").value;
  let description = document.getElementById("taskDescription").value;
  let contact = selectedContactsIDs;
  let date = document.getElementById("date").value;
  let prio = selectedPrio;
  let category = document.getElementById("inputCategory").value;
  let subtask = subtaskInputs;
  return {
    title,
    description,
    contact,
    date,
    prio,
    category,
    subtask,
    status: stautsEmpty(taskStatus),
  };
}

function stautsEmpty(stauts) {
  if (!stauts) {
    return (taskStatus = "todo");
  }
  return taskStatus;
}

function showError(element, message) {
  let parent = element.closest(".add-task-input-fields") || element.closest(".add-task-prio");
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

function validateRequiredFields() {
  let requiredFields = document.querySelectorAll("[required]");
  let isValid = true;
  requiredFields.forEach((field) => {
    field.addEventListener("input", () => showError(field, ""));

    if (!field.value.trim()) {
      if (isValid) {
        isValid = showError(field, "This field is required");
      }
    } else {
      showError(field, "");
    }
  });
  return isValid;
}

function validateContacts() {
  let contactSearch = document.getElementById("contacts-search");
  contactSearch.addEventListener("input", () => showError(contactSearch, ""));
  if (!selectedContactsIDs || !Array.isArray(selectedContactsIDs) || selectedContactsIDs.length === 0) {
    return showError(contactSearch, "Please select at least one contact");
  }
  return showError(contactSearch, "");
}

function validateCategory() {
  let category = document.getElementById("inputCategory");
  category.addEventListener("change", () => showError(category, ""));
  if (!category.value) {
    return showError(category, "Please select a category");
  }
  return showError(category, "");
}

function validatePriority() {
  let priorityButtons = document.querySelectorAll(".add-task-prio button");
  priorityButtons.forEach((button) => {
    button.addEventListener("click", () => showError(button, ""));
  });
  if (!selectedPrio) {
    let priorityContainer = document.querySelector(".add-task-prio");
    return showError(priorityContainer, "Please select a priority");
  }
  return true;
}

function validateData() {
  return validateRequiredFields() && validateContacts() && validateCategory() && validatePriority();
}

function openContactsList(listId) {
  document.getElementById(listId).style.display = "block";
}

function closeContactsList(listId) {
  document.getElementById(listId).style.display = "none";
}

function selectCheckBox(checkboxId, contactId, selectId) {
  let checkStatus = document.getElementById(checkboxId);
  if (checkStatus.checked == true) {
    checkStatus.checked = false;
  } else {
    checkStatus.checked = true;
  }
  focusDiv(selectId);
  toggleCheckbox(contactId);
}

function minDate(dateId) {
  let inputDate = document.getElementById(dateId);
  inputDate.min = todayDate;
}

function focusDiv(divId) {
  document.getElementById(divId).classList.toggle("divFocus");
}
