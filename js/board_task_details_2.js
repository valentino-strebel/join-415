function generateContactsBoardEdit(sortedContacts) {
  let mainTaskKey = tasks[taskKey].id;
  return sortedContacts.map((contact) => editAddContacts(contact.id, contact.name, contact.colorId, currentUser, mainTaskKey)).join("");
}

/**
 * Fetches tasks from the database and stores them in the tasks array.
 * @param {string} [path='tasks/'] - The API path to fetch tasks.
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
async function findDeleteContact(myCheckbox, mainTaskKey) {
  let assigneeArray = [];
  for (let index = 0; index < tasks[taskKey].assigned.length; index++) {
    assigneeArray.push(tasks[taskKey].assigned[index]);
  }
  let assigneeIdentifier = assigneeArray.findIndex((item) => item.mainContactId == myCheckbox.value);
  let assigneeDeleter = tasks[taskKey].assigned[assigneeIdentifier].assigneeId;
  await delete_data((path = `tasks/${mainTaskKey}/contact/${assigneeDeleter}`));
}

function selectCheckBoxEdit(checkboxId, contactId, mainTaskKey) {
  let checkStatus = document.getElementById(checkboxId);
  if (checkStatus.checked == true) {
    checkStatus.checked = false;
  } else {
    checkStatus.checked = true;
  }
  focusDiv("focusEdit-" + contactId + "-" + mainTaskKey);
  assignEditContact(contactId, mainTaskKey);
}

function selectContact(contactId, mainTaskKey) {
  focusDiv("focusEdit-" + contactId + "-" + mainTaskKey);
  assignEditContact(contactId, mainTaskKey);
}

function editAssigneeData() {
  assigneeEditKey = [];
  if (typeof tasks[taskKey].assigned !== "undefined" && tasks[taskKey].assigned.length > 0) {
    assigneeEditSuccess();
  } else {
    document.getElementById("editAssigneeImage").innerHTML = "";
  }
}

function assigneeEditSuccess() {
  for (let indexAssignee = 0; indexAssignee < tasks[taskKey].assigned.length; indexAssignee++) {
    let assigneeId = tasks[taskKey].assigned[indexAssignee].mainContactId;
    let assigneeKey = Object.keys(contacts).find((key) => contacts[key].id == assigneeId);
    if (contacts[assigneeKey] == undefined) {
      continue;
    } else {
      assigneeEditKey.push(assigneeKey);
      editAssigneeImage();
    }
  }
}

function editInsertCheckmark(targetId) {
  for (let indexSelect = 0; indexSelect < selectedAssignee.length; indexSelect++) {
    let id = selectedAssignee[indexSelect];
    document.getElementById(`checkboxEdit-${id}-${targetId}`).checked = true;
    document.getElementById(`focusEdit-${id}-${targetId}`).classList.add("divFocus");
  }
}

function updatePrio(chosenPrio) {
  newPrio = "";
  newPrio = chosenPrio;
}

async function changeMobileTaskStatus(taskId, newStatus) {
  await patch_data((path = `tasks/${taskId}`), (data = { status: newStatus }));
  loadDataBoard();
}
