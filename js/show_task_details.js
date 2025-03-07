function getTaskDetails(taskId) {
  let targetId = taskId;
  taskKey = Object.keys(tasks).find((key) => tasks[key].id == targetId);
  let setPrio = tasks[taskKey].prio;
  prepareTaskDetails(taskKey, targetId, setPrio, taskId);
  window.scrollTo({
    top: 0,
  });
  document.body.style.overflow = "hidden";
}

function prepareTaskDetails(taskKey, targetId, setPrio, taskId) {
  clearTaskDetails();
  getTag(taskKey);
  getHeader(taskKey);
  getDescription(taskKey);
  getTaskDetailsDom(targetId, taskKey);
  getDueDate(taskKey);
  getPriority(setPrio);
  getAssigneeContainer(taskKey);
  getSubtaskContainer(taskKey, taskId);
}

function getTaskDetailsDom(targetId) {
  document.getElementById("taskDetailsButtons").innerHTML = detailsEditDeleteButtons(targetId);
}

function getTag(taskKey) {
  let taskTag = tasks[taskKey].category;
  let backGroundColor = "";
  switch (taskTag) {
    case "Technical Task":
      backGroundColor = tagColors[1];
      break;
    case "User Story":
      backGroundColor = tagColors[0];
  }
  document.getElementById("tagContainer").innerHTML = detailsTagInsert(taskTag, backGroundColor);
}

function getHeader(taskKey) {
  let cleanHeader = tasks[taskKey].title;
  document.getElementById("taskDetailsHeader").innerHTML = detailsHeaderInsert(cleanHeader);
}

function getDescription(taskKey) {
  let cleanDescription = tasks[taskKey].description;
  document.getElementById("taskDetailDescription").innerHTML = detailsDescriptionInsert(cleanDescription);
}

function getDueDate(taskKey) {
  let cleanDate = tasks[taskKey].date.split("-").reverse().join("/");
  document.getElementById("dueDateTR").innerHTML = detailsDueDateInsert(cleanDate);
}

function getPriority(setPrio) {
  let cleanPriority = String(setPrio).charAt(0).toUpperCase() + String(setPrio).slice(1);
  document.getElementById("priorityDetailsTR").innerHTML = detailsPriorityInsert(cleanPriority);
  getPrioImage(setPrio);
}

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

function getAssigneeContainer() {
  document.getElementById("assigneeDetails").innerHTML = assigneeContainerInsert();
  getAssigneeData();
}

function getAssigneeData() {
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

function assigneeDataSuccess(assigneeEditKey, assigneeKey) {
  assigneeEditKey.push(assigneeKey);
  let assignee = contacts[assigneeKey].name;
  let assigneeInitials = contacts[assigneeKey].initials;
  let assigneeColor = contacts[assigneeKey].colorId;
  document.getElementById("assigneeList").innerHTML += detailsAssigneesInsert(assignee, assigneeInitials, assigneeColor);
}

function getSubtaskContainer(taskKey, taskId) {
  document.getElementById("subtaskContainer").innerHTML = detailsSubtaskContainer();
  getSubtaskData(taskKey, taskId);
}

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

//edit task window from here on
function editTaskDetails(targetId) {
  editTag();
  editHeader();
  editDescription();
  editDueDate();
  editPriority();
  editAssignee(targetId);
  editSubtasks();
  createOkSaveButton();
}

function editTag() {
  document.getElementById("tagContainer").innerHTML = "";
}

function editHeader() {
  let headerText = document.getElementById("detailsHeader").innerHTML;
  document.getElementById("taskDetailsHeader").innerHTML = insertEditHeader(headerText);
}

function editDescription() {
  let descriptionText = document.getElementById("detailsDescription").innerHTML;
  document.getElementById("taskDetailDescription").innerHTML = insertEditDescription(descriptionText);
}

function editDueDate() {
  let dueDateText = document.getElementById("dueDateDetails").innerHTML;
  let fixedDateFormat = dueDateText.split("/").reverse().join("-");
  document.getElementById("dueDateTR").innerHTML = insertEditDueDate(fixedDateFormat);
  minDate("inputDueDateEdit");
}

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

async function editAssignee(targetId) {
  document.getElementById("assigneeDetails").innerHTML = insertEditAssignee();
  editAssigneeList();
  editAssigneeImage();
  await renderContactsBoard(contacts, "editAssigneesCheckbox");
  editInsertCheckmark(targetId);
}

function editAssigneeList() {
  document.getElementById("editAssigneeList").innerHTML += insertEditAssigneeSelectionList();
}

function editAssigneeImage() {
  document.getElementById("editAssigneeImage").innerHTML = "";
  selectedAssignee = [];
  for (let indexFind = 0; indexFind < assigneeEditKey.length; indexFind++) {
    let assigneeImageColor = contacts[assigneeEditKey[indexFind]].colorId;
    let assigneeImageInitials = contacts[assigneeEditKey[indexFind]].initials;
    selectedAssignee.push(contacts[assigneeEditKey[indexFind]].id);
    document.getElementById("editAssigneeImage").innerHTML += insertEditAssigneeImage(assigneeImageColor, assigneeImageInitials);
  }
}

function editSubtasks() {
  let mainTaskKey = tasks[taskKey].id;
  document.getElementById("subtaskContainer").innerHTML = "";
  document.getElementById("subtaskContainer").innerHTML = insertSubtaskContainer(mainTaskKey);
  editSubtasksList(mainTaskKey);
}

function editSubtasksList(mainTaskKey) {
  for (let indexTaskKey = 0; indexTaskKey < tasks[taskKey].subtasks.length; indexTaskKey++) {
    let subtaskText = tasks[taskKey].subtasks[indexTaskKey].text;
    let subtaskId = tasks[taskKey].subtasks[indexTaskKey].id;
    document.getElementById("substaskListDetails").innerHTML += insertSubtasksList(subtaskText, subtaskId, mainTaskKey);
  }
}

async function subtaskStatusChange(subtaskId, taskKey, subtaskEditId, statusText) {
  let checkStatus = document.getElementById(subtaskEditId);
  let statusChange = 0;
  if (checkStatus.checked == true) {
    statusChange = 1;
  } else {
    statusChange = 0;
  }
  await edit_data(
    (path = `tasks/${taskKey}/subtask/${subtaskId}`),
    (data = {
      text: statusText,
      checked: statusChange,
    }),
  );
  await getTasks();
  renderTasks();
}

async function deleteTask(path) {
  await delete_data(path);
  window.location.reload();
}

async function deleteSubtask(path) {
  await delete_data(path);
  await loadDataBoard();
  editSubtasks();
}

function clearSubtaskInput(inputId) {
  document.getElementById(inputId).value = "";
}

async function addEditSubtask(inputId, mainTaskId) {
  let inputValidate = document.getElementById(inputId);
  let inputText = inputValidate.value.trim();
  if (inputText == "") {
    inputValidate.setCustomValidity("Please insert a subtask description");
    inputValidate.reportValidity();
    return true;
  } else {
    await update_data(
      (path = `tasks/${mainTaskId}/subtask`),
      (data = {
        text: inputText,
        checked: 0,
      }),
    );
    clearSubtaskInput(inputId);
    await loadDataBoard();
    editSubtasks();
  }
}

function createOkSaveButton() {
  let mainTaskKey = tasks[taskKey].id;
  document.getElementById("taskDetailsButtons").innerHTML = insertOkSaveButton(mainTaskKey);
}

async function updateListEdit(index, mainTaskKey) {
  let listItem = document.getElementById(`listItem-${index}`);
  let textChange = listItem.innerText;
  let editIcon = document.getElementById(`editIcon-${index}`);
  let checkIcon = document.getElementById(`checkIcon-${index}`);
  if (textChange == "\n") {
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
  await getTasks();
  getTaskDetails(mainTaskKey);
  editTaskDetails(mainTaskKey);
}

function handleEnterEdit(event, index, mainTaskKey) {
  if (event.key === "Enter") {
    event.preventDefault();
    updateListEdit(index, mainTaskKey);
  }
}

async function saveEditedTaskDetails(updatePath, mainTaskKey) {
  let updateTitle = document.getElementById("inputTitleEdit").value;
  let updateDesc = document.getElementById("inputDescriptionEdit").value;
  let updateDate = document.getElementById("inputDueDateEdit").value;
  let updatePrio = newPrio;
  await patch_data(
    (path = updatePath),
    (data = {
      title: updateTitle,
      description: updateDesc,
      date: updateDate,
      prio: updatePrio,
    }),
  );
  await getTasks();
  await renderTasks();
  getTaskDetails(mainTaskKey);
}

async function renderContactsBoard(filteredContacts, divId) {
  let sortedContacts = await sortContacts(filteredContacts);
  let list = document.getElementById(divId);
  list.innerHTML = await generateContactsBoardEdit(sortedContacts);
  list.style.display = "none";
}
