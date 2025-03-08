/**
 * Generates a contacts board edit section.
 *
 * @param {Array} sortedContacts - An array of contact objects containing id, name, and colorId.
 * @returns {string} - A string representation of the edited contacts board.
 */
function generateContactsBoardEdit(sortedContacts) {
  let mainTaskKey = tasks[taskKey].id;
  return sortedContacts.map((contact) => editAddContacts(contact.id, contact.name, contact.colorId, currentUser, mainTaskKey)).join("");
}

/**
 * Assigns or unassigns a contact to a task based on the checkbox state.
 *
 * @async
 * @param {string} contactId - The ID of the contact being assigned or unassigned.
 * @param {string} mainTaskKey - The ID of the main task.
 */
async function assignEditContact(contactId, mainTaskKey) {
  let myCheckbox = document.getElementById(`checkboxEdit-${contactId}-${mainTaskKey}`);
  if (myCheckbox.checked == true) {
    await update_data(
      (path = `tasks/${mainTaskKey}/contact/`),
      (data = {
        id: contactId,
      }),
    );
  } else {
    await findDeleteContact(myCheckbox, mainTaskKey);
  }
  await loadDataBoard();
  editAssigneeData();
}

/**
 * Finds and deletes a contact from a task assignment.
 *
 * @async
 * @param {HTMLElement} myCheckbox - The checkbox element of the contact being unassigned.
 * @param {string} mainTaskKey - The ID of the main task.
 */
async function findDeleteContact(myCheckbox, mainTaskKey) {
  let assigneeArray = [];
  for (let index = 0; index < tasks[taskKey].assigned.length; index++) {
    assigneeArray.push(tasks[taskKey].assigned[index]);
  }
  let assigneeIdentifier = assigneeArray.findIndex((item) => item.mainContactId == myCheckbox.value);
  let assigneeDeleter = tasks[taskKey].assigned[assigneeIdentifier].assigneeId;
  await delete_data((path = `tasks/${mainTaskKey}/contact/${assigneeDeleter}`));
}
/**
 * Toggles the checkbox state and updates the UI for editing a contact.
 * @param {string} checkboxId - The ID of the checkbox element.
 * @param {string} contactId - The ID of the contact.
 * @param {string} mainTaskKey - The key for the main task.
 */
function selectCheckBoxEdit(checkboxId, contactId, mainTaskKey) {
  let checkStatus = document.getElementById(checkboxId);
  checkStatus.checked = !checkStatus.checked;
  focusDiv(`focusEdit-${contactId}-${mainTaskKey}`);
  assignEditContact(contactId, mainTaskKey);
}

/**
 * Focuses on the contact div when clicking on it and assigns the contact for editing.
 * @param {string} contactId - The ID of the contact.
 * @param {string} mainTaskKey - The key for the main task.
 */
function selectContact(contactId, mainTaskKey) {
  focusDiv(`focusEdit-${contactId}-${mainTaskKey}`);
  assignEditContact(contactId, mainTaskKey);
}

/**
 * Initializes the editing process for assignees.
 */
function editAssigneeData() {
  assigneeEditKey = [];
  if (typeof tasks[taskKey].assigned !== "undefined" && tasks[taskKey].assigned.length > 0) {
    assigneeEditSuccess();
  } else {
    document.getElementById("editAssigneeImage").innerHTML = "";
  }
}

/**
 * Processes assigned contacts and updates the UI accordingly, adding the assignee circle with initials to task.
 */
function assigneeEditSuccess() {
  for (let indexAssignee = 0; indexAssignee < tasks[taskKey].assigned.length; indexAssignee++) {
    let assigneeId = tasks[taskKey].assigned[indexAssignee].mainContactId;
    let assigneeKey = Object.keys(contacts).find((key) => contacts[key].id == assigneeId);
    if (contacts[assigneeKey] !== undefined) {
      assigneeEditKey.push(assigneeKey);
      editAssigneeImage();
    }
  }
}

/**
 * Inserts a checkmark for selected assignees if assignee is preselected and updates the UI.
 * @param {string} targetId - The target ID to apply changes to.
 */
function editInsertCheckmark(targetId) {
  for (let indexSelect = 0; indexSelect < selectedAssignee.length; indexSelect++) {
    let id = selectedAssignee[indexSelect];
    document.getElementById(`checkboxEdit-${id}-${targetId}`).checked = true;
    document.getElementById(`focusEdit-${id}-${targetId}`).classList.add("divFocus");
  }
}

/**
 * Updates the priority with the chosen value.
 * @param {string} chosenPrio - The selected priority value.
 */
function updatePrio(chosenPrio) {
  newPrio = chosenPrio;
}
/**
 * Updates the status of task in mobile view.
 * @param {string} taskId - The ID of the task.
 * @param {string} newStatus - The new status to be set.
 */
async function changeMobileTaskStatus(taskId, newStatus) {
  await patch_data((path = `tasks/${taskId}`), (data = { status: newStatus }));
  loadDataBoard();
}

/**
 * Saves the edited task details and updates the task view.
 * @param {string} updatePath - The path to update the task.
 * @param {string} mainTaskKey - The key for the main task.
 */
async function saveEditedTaskDetails(updatePath, mainTaskKey) {
  let updateTitle = document.getElementById("inputTitleEdit").value;
  let updateDesc = document.getElementById("inputDescriptionEdit").value;
  let updateDate = document.getElementById("inputDueDateEdit").value;
  let updatePrio = newPrio;
  await submitTaskChanges(updateTitle, updateDesc, updateDate, updatePrio, updatePath);
  await getTasks();
  await renderTasks();
  getTaskDetails(mainTaskKey);
}

/**
 * Submits changes to the task via a patch request.
 */
async function submitTaskChanges() {
  await patch_data(
    (path = updatePath),
    (data = {
      title: updateTitle,
      description: updateDesc,
      date: updateDate,
      prio: updatePrio,
    }),
  );
}

/**
 * Updates a specific list item in the task edit view, getting the data from the div ID.
 * @param {number} index - The index of the list item.
 * @param {string} mainTaskKey - The key for the main task.
 */
async function updateListEdit(index, mainTaskKey) {
  let listItem = document.getElementById(`listItem-${index}`);
  let textChange = listItem.innerText;
  let editIcon = document.getElementById(`editIcon-${index}`);
  let checkIcon = document.getElementById(`checkIcon-${index}`);
  await submitSubtaskChanges(textChange, index, mainTaskKey, listItem, editIcon, checkIcon);
  await getTasks();
  getTaskDetails(mainTaskKey);
  editTaskDetails(mainTaskKey);
}

/**
 * Submits subtask changes or deletes the subtask if empty.
 * @param {string} textChange - The updated text of the subtask.
 * @param {number} index - The index of the subtask.
 * @param {string} mainTaskKey - The key for the main task.
 * @param {HTMLElement} listItem - The HTML element representing the subtask.
 * @param {HTMLElement} editIcon - The edit icon element.
 * @param {HTMLElement} checkIcon - The check icon element.
 */
async function submitSubtaskChanges(textChange, index, mainTaskKey, listItem, editIcon, checkIcon) {
  if (textChange.trim() === "") {
    deleteSubtask(`tasks/${mainTaskKey}/subtask/${index}`);
  } else {
    await patch_data(
      (path = `tasks/${mainTaskKey}/subtask/${index}`),
      (data = {
        text: textChange,
      }),
    );
    listItem.setAttribute("contenteditable", "false");
    editIcon.style.display = "block";
    checkIcon.style.display = "none";
  }
}
/**
 * Adds or edits a subtask after validating input.
 * @param {string} inputId - The ID of the input field.
 * @param {string} mainTaskId - The ID of the main task.
 * @returns {boolean} Returns true if input is invalid.
 */
async function addEditSubtask(inputId, mainTaskId) {
  let inputValidate = document.getElementById(inputId);
  let inputText = inputValidate.value.trim();
  if (inputText === "") {
    inputValidate.setCustomValidity("Please insert a subtask description");
    inputValidate.reportValidity();
    return true;
  } else {
    await submitSubTextChange(mainTaskId, inputText);
    clearSubtaskInput(inputId);
    await loadDataBoard();
    editSubtasks();
  }
}

/**
 * Submits a new subtask text to be added.
 * @param {string} mainTaskId - The ID of the main task.
 * @param {string} inputText - The text of the subtask.
 */
async function submitSubTextChange(mainTaskId, inputText) {
  await update_data(
    (path = `tasks/${mainTaskId}/subtask`),
    (data = {
      text: inputText,
      checked: 0,
    }),
  );
}

/**
 * Changes the status of a subtask (checked/unchecked) and updates the UI.
 * @param {string} subtaskId - The ID of the subtask.
 * @param {string} taskKey - The key of the main task.
 * @param {string} subtaskEditId - The ID of the subtask edit element.
 * @param {string} statusText - The text of the subtask.
 */
async function subtaskStatusChange(subtaskId, taskKey, subtaskEditId, statusText) {
  let checkStatus = document.getElementById(subtaskEditId);
  let statusChange = checkStatus.checked ? 1 : 0;
  await submitStatusChange(subtaskId, taskKey, statusText, statusChange);
  await getTasks();
  renderTasks();
}

/**
 * Submits the subtask status change to the database.
 * @param {string} subtaskId - The ID of the subtask.
 * @param {string} taskKey - The key of the main task.
 * @param {string} statusText - The text of the subtask.
 * @param {number} statusChange - The new status (0 for unchecked, 1 for checked).
 */
async function submitStatusChange(subtaskId, taskKey, statusText, statusChange) {
  await edit_data(
    (path = `tasks/${taskKey}/subtask/${subtaskId}`),
    (data = {
      text: statusText,
      checked: statusChange,
    }),
  );
}

/**
 * Deletes a task and reloads the page.
 * @param {string} path - The API path to delete the task.
 */
async function deleteTask(path) {
  await delete_data(path);
  window.location.reload();
}

/**
 * Deletes a subtask and updates the UI.
 * @param {string} path - The API path to delete the subtask.
 */
async function deleteSubtask(path) {
  await delete_data(path);
  await loadDataBoard();
  editSubtasks();
}
