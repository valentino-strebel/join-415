function detailsTagInsert(taskTag, backGroundColor) {
  return `
    <div class="tag" style="background-color:${backGroundColor}">
      <p class="size23">${taskTag}</p>
    </div>
  `;
}

function detailsHeaderInsert(cleanHeader) {
  return `
  <p id="detailsHeader" class="weight700 size61">${cleanHeader}</p>
  `;
}

function detailsDescriptionInsert(cleanDescription) {
  return `
  <p id="detailsDescription" class="weight400 size20">${cleanDescription}</p>
  `;
}

function detailsDueDateInsert(cleanDate) {
  return `
    <td class="weight400 size20 colorDarkBlue">Due Date:</td>
    <td id="dueDateDetails" class="weight400 size20">${cleanDate}</td>
  `;
}

function detailsPriorityInsert(cleanPriority) {
  return `
    <td class="weight400 size20 colorDarkBlue">Priority:</td>
    <td class="displayFlex">
      <p class="weight400 size20">${cleanPriority}</p>
      <img id="priorityIcon" src="" alt="Priority Icon" />
    </td>
  `;
}

function assigneeContainerInsert() {
  return `
    <p class="weight400 size20 colorDarkBlue">Assigned to:</p>
    <div id="assigneeList" class="assigneeList"></div>
  `;
}

function detailsAssigneesInsert(assignee, assigneeInitials, assigneeColor) {
  return `
    <div class="assignee">
      <div class="background-contacts" style="background-color: ${bgcolors[assigneeColor].rgba}">
        <p class="weight400 size12">${assigneeInitials}</p>
      </div>
      <p class="weight400 size19">${assignee}</p>
    </div>
  `;
}

function detailsSubtaskContainer() {
  return `
    <p class="weight400 size20 colorDarkBlue">Substasks</p>
    <div id="substaskListDetails" class="subtaskList"></div>
  `;
}

function detailsSubtaskInsert(indexSubtask, subtaskList, subtaskId, taskId) {
  return `
    <div class="subtask">
      <input
        onclick="subtaskStatusChange('${subtaskId}', '${taskId}', this.id, '${subtaskList}')"
        id="subtaskCheck${indexSubtask}"
        type="checkbox"
      />
      <label for="subtaskCheck${indexSubtask}"></label>

      <p class="weight400 size16">${subtaskList}</p>
    </div>
  `;
}

function detailsEditDeleteButtons(targetId) {
  return `
    <div class="detailsEdit">
      <button onclick="deleteTask('tasks/${targetId}')">
        <img src="../assets/icons/contacts/delete.svg" alt="Delete Symbol" />
        <p class="weight400 size16 colorDarkBlue">Delete</p>
      </button>
       <div class="edit-board-seperator" style="display:none"></div>
      <button onclick="editTaskDetails('${targetId}')">
        <img src="../assets/icons/contacts/edit.svg" alt="Edit Symbol" />
        <p class="weight400 size16 colorDarkBlue">Edit</p>
      </button>
    </div>
  `;
}

function insertEditHeader(headerText) {
  return `
    <p class="weight400 size16 editHeadline">Title</p>
    <div class="add-task-input-fields">
      <input id="inputTitleEdit" value="${headerText}" type="text" />
    </div>
  `;
}

function insertEditDescription(descriptionText) {
  return `
    <p class="weight400 size16 editHeadline">Description</p>
    <div class="add-task-input-fields">
      <textarea
        id="inputDescriptionEdit"
        type="text"
      >${descriptionText}</textarea>
    </div>
  `;
}

function insertEditDueDate(dueDateText) {
  return `
    <p class="weight400 size16 editHeadline">Due Date</p>
    <div class="add-task-input-fields">
      <input value="${dueDateText}"  type="date" id="inputDueDateEdit" />
    </div>
  `;
}

function insertEditPriority() {
  return `
    <p class="weight700 size16 colorLightGrey editHeadline">Priority</p>
    <div class="add-task-input-fields">
      <div class="add-task-prio">
        <button
          class="button-prio-urgent"
          id="buttonUrgentEdit"
          onclick="setButtonColor('UrgentEdit', '#FF3D00'), updatePrio('urgent')"
        >
          Urgent<img
            src="../assets/icons/add_task/prio-urgent-icon.svg"
            alt="Urgent priority"
          />
        </button>
        <button
          class="button-prio-medium"
          id="buttonMediumEdit"
          onclick="setButtonColor('MediumEdit', '#FFA800'), updatePrio('medium')"
        >
          Medium<img
            src="../assets/icons/add_task/prio-medium-icon.svg"
            alt="Medium priority"
          />
        </button>
        <button
          class="button-prio-low"
          id="buttonLowEdit"
          onclick="setButtonColor('LowEdit', '#7AE229'), updatePrio('low')"
        >
          Low<img
            src="../assets/icons/add_task/prio-low-icon.svg"
            alt="Low priority"
          />
        </button>
      </div>
    </div>
  `;
}

function insertEditAssignee() {
  return `
    <div class="add-task-input-fields editAssigned">
      <div class="editHeadline">Assigned to<span class="add-task-required">*</span></div>
    </div>
    <div class="add-task-contacts editAssignedInput">
      <input
        type="text"
        id="editAssigneesSearch"
        onclick="openContactsList('editAssigneesCheckbox')"
        oninput="filterContacts('editAssigneesCheckbox')"
        placeholder="Select contacts to assign"
      />
    </div>
    <div id="editAssigneeList"></div>
    <div class="displayFlex" id="editAssigneeImage"></div>
  `;
}

function insertEditAssigneeSelectionList() {
  return `
    <ul
      class="add-task-items"
      id="editAssigneesCheckbox"
      style="display: none"
    ></ul>
  `;
}

function insertEditAssigneeImage(assigneeImageColor, assigneeImageInitials) {
  return `
    <div
      class="background-contacts"
      style="background-color: ${bgcolors[assigneeImageColor].rgba}"
    >
      <p class="weight400 size12">${assigneeImageInitials}</p>
    </div>
  `;
}

function insertSubtaskContainer(mainTaskKey) {
  return `
    <div class="add-task-input-fields editAssigned">
      <p class="weight400 size16 editHeadline">Subtasks</p>
      <div class="add-task-input-subtasks">
        <input
          type="text"
          id="subtaskEditInput"
          placeholder="Add new subtask"
          onclick="showButtons('addIconEdit','checkCrossEdit')"
          onfocusout="hideButtons('subtaskEditInput','checkCrossEdit','addIconEdit')"
        />
        <div class="add-task-subtasks-icons-wrapper">
          <div id="addIconEdit">
            <div class="add-task-subtasks-icon">
              <div
                class="add-task-subtasks-add"
                onclick="selectInput('subtaskEditInput','addIconEdit','checkCrossEdit')"
              >
                <img
                  src="../assets/icons/add_task/add-icon.svg"
                  alt="Add subtask"
                />
              </div>
            </div>
          </div>
          <div class="add-task-subtasks-check-cross" id="checkCrossEdit">
            <div
              class="add-task-subtasks-icon"
              onclick="clearSubtaskInput('subtaskEditInput')"
            >
              <img src="../assets/icons/add_task/cross-icon.svg" alt="Cancel" />
            </div>
            <div class="add-task-subtasks-seperator"></div>
            <div
              class="add-task-subtasks-icon"
              onclick="addEditSubtask('subtaskEditInput', '${mainTaskKey}')"
            >
              <img
                class="add-task-subtasks-check"
                src="../assets/icons/add_task/check-icon.svg"
                alt="Confirm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="subtaskList">
      <ul id="substaskListDetails" class="subtask-list-container"></ul>
    </div>
  `;
}

function insertSubtasksList(subtaskText, subtaskId, mainTaskKey) {
  return `
    <div class="list-item-container" id="list-item-container-${subtaskId}">
      <li
        class="subtask-list-items"
        id="listItem-${subtaskId}"
        contenteditable="false"
        onblur="updateListEdit('${subtaskId}', '${mainTaskKey}')"
        onkeydown="handleEnterEdit(event, '${subtaskId}','${mainTaskKey}')"
      >
        ${subtaskText}
      </li>
      <div class="list-icons-wrapper">
        <div class="list-icons">
          <img
            src="../assets/icons/add_task/edit.svg"
            alt="Edit"
            class="edit-icon"
            onclick="editListItem('${subtaskId}')"
            id="editIcon-${subtaskId}"
          />
          <img
            src="../assets/icons/add_task/check-icon.svg"
            alt="Check"
            class="check-icon"
            onclick="updateListEdit('${subtaskId}', '${mainTaskKey}')"
            id="checkIcon-${subtaskId}"
            style="display: none;"
          />
        </div>
        <div class="list-icon-seperator"></div>
        <div class="list-icons">
          <img
            src="../assets/icons/add_task/delete.svg"
            alt="Delete"
            onclick="deleteSubtask('tasks/${mainTaskKey}/subtask/${subtaskId}')"
          />
        </div>
      </div>
    </div>
  `;
}

function insertOkSaveButton(mainTaskKey) {
  return `
    <div class="add-task-bottom-buttons-overlay">
      <button
        class="add-task-button-create-overlay"
        onclick="saveEditedTaskDetails('tasks/${mainTaskKey}','${mainTaskKey}')"
      >
        Ok<img src="../assets/icons/task_details/check.svg" alt="Check Mark" />
      </button>
    </div>
  `;
}

function editAddContacts(id, name, colorId, currentUser, mainTaskKey) {
  return ` <div id="focusEdit-${id}-${mainTaskKey}">
    <li
      onclick="selectCheckBoxEdit('checkboxEdit-${id}-${mainTaskKey}', '${id}', '${mainTaskKey}')"
    >
      <div
        class="background-contacts bg-contact-chechbox"
        style="background-color: ${bgcolors[colorId].rgba};"
      >
        ${getInitials(name)}
      </div>
      <p class="checkbox-name size20">
        ${name}${currentUser.name === name ? " (You)" : ""}
      </p>
      <input
        type="checkbox"
        id="checkboxEdit-${id}-${mainTaskKey}"
        class="add-task-checkmark"
        value="${id}"
        onclick="selectContact('${id}', '${mainTaskKey}'), noBubble(event)"
      />
    </li>
  </div>`;
}
