/**
 * Retrieves and displays task details based on the given task ID.
 *
 * @param {number} taskId - The ID of the task to retrieve details for.
 */
function getTaskDetails(taskId) {
  let targetId = taskId;
  let taskKey = tasks.findIndex((task) => task.id === targetId);
  console.log(taskId);
  let setPrio = tasks[taskKey].prio;

  prepareTaskDetails(taskKey, targetId, setPrio, taskId);

  window.scrollTo({ top: 0 });
  document.body.style.overflow = "hidden";
}

/**
 * Prepares the task details by calling relevant functions to display task information.
 *
 * @param {string} taskKey - The key of the task in the tasks object.
 * @param {number} targetId - The target task ID.
 * @param {string} setPrio - The priority level of the task.
 * @param {number} taskId - The ID of the task.
 */
function prepareTaskDetails(taskKey, targetId, setPrio, taskId) {
  clearTaskDetails();
  getTag(taskKey);
  getHeader(taskKey);
  getDescription(taskKey);
  getTaskDetailsDom(targetId);
  getDueDate(taskKey);
  getPriority(setPrio);
  getAssigneeContainer(taskKey);
  getSubtaskContainer(taskKey, taskId);
}

/**
 * Updates the DOM with task details buttons for editing and deleting.
 *
 * @param {number} targetId - The ID of the task.
 */
function getTaskDetailsDom(targetId) {
  document.getElementById("taskDetailsButtons").innerHTML = detailsEditDeleteButtons(targetId);
}

/**
 * Retrieves the category tag of a task and updates the UI with the appropriate color.
 *
 * @param {string} taskKey - The key of the task in the tasks object.
 */
function getTag(taskKey) {
  let taskTag = tasks[taskKey].category;
  let backGroundColor = "";

  switch (taskTag) {
    case "Technical Task":
      backGroundColor = tagColors[1];
      break;
    case "User Story":
      backGroundColor = tagColors[0];
      break;
  }

  document.getElementById("tagContainer").innerHTML = detailsTagInsert(taskTag, backGroundColor);
}

/**
 * Retrieves the task title and updates the UI header.
 *
 * @param {string} taskKey - The key of the task in the tasks object.
 */
function getHeader(taskKey) {
  let cleanHeader = tasks[taskKey].title;
  document.getElementById("taskDetailsHeader").innerHTML = detailsHeaderInsert(cleanHeader);
}
/**
 * Retrieves and displays the description of a task.
 * @param {string} taskKey - The key identifying the task.
 */
function getDescription(taskKey) {
  let cleanDescription = tasks[taskKey].description;
  document.getElementById("taskDetailDescription").innerHTML = detailsDescriptionInsert(cleanDescription);
}

/**
 * Retrieves and formats the due date of a task, then displays it.
 * @param {string} taskKey - The key identifying the task.
 */
function getDueDate(taskKey) {
  let cleanDate = tasks[taskKey].date.split("-").reverse().join("/");
  document.getElementById("dueDateTR").innerHTML = detailsDueDateInsert(cleanDate);
}

/**
 * Retrieves and displays the priority level of a task.
 * @param {string} setPrio - The priority level of the task ('low', 'medium', 'urgent').
 */
function getPriority(setPrio) {
  let cleanPriority = String(setPrio).charAt(0).toUpperCase() + String(setPrio).slice(1);
  document.getElementById("priorityDetailsTR").innerHTML = detailsPriorityInsert(cleanPriority);
  getPrioImage(setPrio);
}

/**
 * Retrieves and updates the priority icon based on the priority level.
 * @param {string} setPrio - The priority level ('low', 'medium', 'urgent').
 */
function getPrioImage(setPrio) {
  let prioUrl = document.getElementById("priorityIcon");
  switch (setPrio) {
    case "low":
      prioUrl.src = urgencySymbols[0];
      break;
    case "medium":
      prioUrl.src = urgencySymbols[1];
      break;
    case "urgent":
      prioUrl.src = urgencySymbols[2];
  }
}

/**
 * Initializes the assignee container and loads the assignee data.
 */
function getAssigneeContainer(taskKey) {
  document.getElementById("assigneeDetails").innerHTML = assigneeContainerInsert();
  getAssigneeData(taskKey);
}

/**
 * Retrieves and processes the assigned contacts for a task.
 */
function getAssigneeData(taskKey) {
  assigneeEditKey = [];
  for (let indexAssignee = 0; indexAssignee < tasks[taskKey].assigned.length; indexAssignee++) {
    let assigneeId = tasks[taskKey].assigned[indexAssignee].mainContactId;
    let assigneeKey = Object.keys(contacts).find((key) => contacts[key].id == assigneeId);
    if (contacts[assigneeKey] == undefined) {
      continue;
    } else {
      assigneeDataSuccess(assigneeEditKey, assigneeKey);
    }
  }
}

/**
 * Processes and displays the assigned contact details.
 * @param {Array} assigneeEditKey - The array storing assigned contact keys.
 * @param {string} assigneeKey - The key of the assigned contact.
 */
function assigneeDataSuccess(assigneeEditKey, assigneeKey) {
  assigneeEditKey.push(assigneeKey);
  let assignee = contacts[assigneeKey].name;
  let assigneeInitials = contacts[assigneeKey].initials;
  let assigneeColor = contacts[assigneeKey].colorId;
  document.getElementById("assigneeList").innerHTML += detailsAssigneesInsert(assignee, assigneeInitials, assigneeColor);
}

/**
 * Initializes the subtask container and loads its data.
 * @param {string} taskKey - The key identifying the task.
 * @param {string} taskId - The ID of the task.
 */
function getSubtaskContainer(taskKey, taskId) {
  document.getElementById("subtaskContainer").innerHTML = detailsSubtaskContainer();
  getSubtaskData(taskKey, taskId);
}
/**
 * Retrieves and displays subtasks for a given task.
 * @param {string} taskKey - The key of the task.
 * @param {number} taskId - The ID of the task.
 */
function getSubtaskData(taskKey, taskId) {
  if (tasks[taskKey].subtasks == undefined) {
    return;
  } else {
    for (let indexSubtask = 0; indexSubtask < tasks[taskKey].subtasks.length; indexSubtask++) {
      let subtaskList = tasks[taskKey].subtasks[indexSubtask].text;
      let subtaskId = tasks[taskKey].subtasks[indexSubtask].id;
      document.getElementById("substaskListDetails").innerHTML += detailsSubtaskInsert(indexSubtask, subtaskList, subtaskId, taskId);
    }
  }
  getSubtaskStatus(taskKey);
}

/**
 * Updates the status of subtasks based on their checked state.
 * @param {string} taskKey - The key of the task.
 */
function getSubtaskStatus(taskKey) {
  for (let indexSubStatus = 0; indexSubStatus < tasks[taskKey].subtasks.length; indexSubStatus++) {
    let subtaskStatus = tasks[taskKey].subtasks[indexSubStatus].checked;
    let statusCheck = document.getElementById(`subtaskCheck${indexSubStatus}`);
    switch (subtaskStatus) {
      case 0:
        statusCheck.checked = false;
        break;
      case 1:
        statusCheck.checked = true;
    }
  }
}

/**
 * Clears all task detail fields in the UI.
 */
function clearTaskDetails() {
  document.getElementById("tagContainer").innerHTML = "";
  document.getElementById("taskDetailsHeader").innerHTML = "";
  document.getElementById("taskDetailDescription").innerHTML = "";
  document.getElementById("dueDateTR").innerHTML = "";
  document.getElementById("priorityDetailsTR").innerHTML = "";
  document.getElementById("tagContainer").innerHTML = "";
  document.getElementById("assigneeDetails").innerHTML = "";
  document.getElementById("subtaskContainer").innerHTML = "";
  document.getElementById("taskDetailsButtons").innerHTML = "";
}

/**
 * Enables editing mode for task details.
 * @param {number} targetId - The ID of the task to be edited.
 */
function editTaskDetails(targetId) {
  editTag();
  editHeader();
  editDescription();
  editDueDate();
  editPriority();
  editAssignee(targetId);
  editSubtasks(targetId);
  createOkSaveButton(targetId);
}

/**
 * Clears the tag container for editing.
 */
function editTag() {
  document.getElementById("tagContainer").innerHTML = "";
}

/**
 * Enables editing mode for the task header.
 */
function editHeader() {
  let headerText = document.getElementById("detailsHeader").innerHTML;
  document.getElementById("taskDetailsHeader").innerHTML = insertEditHeader(headerText);
}

/**
 * Enables editing mode for the task description.
 */
function editDescription() {
  let descriptionText = document.getElementById("detailsDescription").innerHTML;
  document.getElementById("taskDetailDescription").innerHTML = insertEditDescription(descriptionText);
}

/**
 * Enables editing mode for the task due date.
 */
function editDueDate() {
  let dueDateText = document.getElementById("dueDateDetails").innerHTML;
  let fixedDateFormat = dueDateText.split("/").reverse().join("-");
  document.getElementById("dueDateTR").innerHTML = insertEditDueDate(fixedDateFormat);
  minDate("inputDueDateEdit");
}
/**
 * Updates the priority editing UI and sets the button colors based on the current priority.
 */
function editPriority() {
  let setPrioEdit = tasks[taskKey].prio;
  document.getElementById("priorityDetailsTR").innerHTML = insertEditPriority();
  switch (setPrioEdit) {
    case "low":
      setButtonColor("LowEdit", "#7AE229");
      break;
    case "medium":
      setButtonColor("MediumEdit", "#FFA800");
      break;
    case "urgent":
      setButtonColor("UrgentEdit", "#FF3D00");
  }
  updatePrio(setPrioEdit);
}

/**
 * Initiates the editing of an assignee by updating the UI and rendering the contacts board.
 * @param {string} targetId - The ID of the target element.
 */
async function editAssignee(targetId) {
  document.getElementById("assigneeDetails").innerHTML = insertEditAssignee();
  editAssigneeList();
  await editAssigneeImage();
  await renderContactsBoard(targetId, contacts, "editAssigneesCheckbox");
  editInsertCheckmark(targetId);
}

/**
 * Updates the list of assignees available for selection.
 */
function editAssigneeList() {
  document.getElementById("editAssigneeList").innerHTML += insertEditAssigneeSelectionList();
}

/**
 * Updates the displayed images of selected assignees.
 */
async function editAssigneeImage() {
  document.getElementById("editAssigneeImage").innerHTML = "";
  selectedAssignee = [];
  for (let indexFind = 0; indexFind < assigneeEditKey.length; indexFind++) {
    let assigneeImageColor = contacts[assigneeEditKey[indexFind]].colorId;
    let assigneeImageInitials = contacts[assigneeEditKey[indexFind]].initials;
    selectedAssignee.push(contacts[assigneeEditKey[indexFind]].id);
    document.getElementById("editAssigneeImage").innerHTML += insertEditAssigneeImage(assigneeImageColor, assigneeImageInitials);
  }
}

/**
 * Updates the UI for editing subtasks of a task.
 */
function editSubtasks(targetId) {
  let taskKey = tasks.findIndex((task) => task.id === targetId);
  document.getElementById("subtaskContainer").innerHTML = "";
  document.getElementById("subtaskContainer").innerHTML = insertSubtaskContainer(targetId);
  editSubtasksList(targetId, taskKey);
}

/**
 * Populates the list of subtasks for the given task.
 * @param {string} mainTaskKey - The unique identifier for the main task.
 */
function editSubtasksList(mainTaskKey, taskKey) {
  for (let indexTaskKey = 0; indexTaskKey < tasks[taskKey].subtasks.length; indexTaskKey++) {
    let subtaskText = tasks[taskKey].subtasks[indexTaskKey].text;
    let subtaskId = tasks[taskKey].subtasks[indexTaskKey].id;
    document.getElementById("substaskListDetails").innerHTML += insertSubtasksList(subtaskText, subtaskId, mainTaskKey);
  }
}

/**
 * Clears the value of the given input field.
 * @param {string} inputId - The ID of the input field to clear.
 */
function clearSubtaskInput(inputId) {
  document.getElementById(inputId).value = "";
}

/**
 * Creates and displays the "OK" and "Save" buttons for task editing.
 */
function createOkSaveButton(targetId) {
  let taskKey = tasks.findIndex((task) => task.id === targetId);
  let mainTaskKey = tasks[taskKey].id;
  document.getElementById("taskDetailsButtons").innerHTML = insertOkSaveButton(mainTaskKey);
}

/**
 * Handles the "Enter" key event when editing a list item.
 * @param {KeyboardEvent} event - The keyboard event.
 * @param {number} index - The index of the item being edited.
 * @param {string} mainTaskKey - The unique identifier for the main task.
 */
function handleEnterEdit(event, index, mainTaskKey) {
  if (event.key === "Enter") {
    event.preventDefault();
    updateListEdit(index, mainTaskKey);
  }
}

/**
 * Renders the contacts board with filtered contacts in a given container.
 * @param {Array} filteredContacts - The list of filtered contacts to display.
 * @param {string} divId - The ID of the container where the contacts will be rendered.
 */
async function renderContactsBoard(targetId, filteredContacts, divId) {
  let sortedContacts = await sortContacts(filteredContacts);
  let list = document.getElementById(divId);
  list.innerHTML = await generateContactsBoardEdit(targetId, sortedContacts);
  list.style.display = "none";
}
