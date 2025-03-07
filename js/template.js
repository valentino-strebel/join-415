function listContactHeader(letter) {
  return `
    <div class="contactsHeader size20"><p>${letter}</p></div>
    <div class="contactsSeperator"></div>
  `;
}

function listContactData(contact, index, currentUser) {
  return `
    <div
      class="contactsContainer"
      tabindex="0"
      onclick="mobileContactDetails('contactsDetailsMobile', 'contactsDetails', 'contactsDetailsOpen'), openContactDetails(${index}), showContactDetails('contactsDisplay', 'detailsWindowClosed', 'detailsWindow'), noBubble(event)"
    >
      <div class="background-contacts" style="background-color: ${bgcolors[contact.colorId].rgba};">
        ${getInitials(contact.name)}
      </div>
      <div class="contactsContainerUserinfo">
        <p class="weight400 size20">${contact.name}${currentUser.name === contact.name ? " (You)" : ""}</p>
        <a class="weight400 size16 emailLink"
          >${contact.email}</a
        >
      </div>
    </div>
  `;
}

function detailsProfileInsert(contact, index) {
  return `
    <div
      class="background-contacts bg-details"
      style="background-color: ${bgcolors[contact.colorId].rgba};"
    >
      ${getInitials(contact.name)}
    </div>
    <div class="detailsName">
      <listedName>${contact.name}</listedName>
      <div id="editButtonsPosition" class="editButtonsPosition">
        <div class="detailsEdit">
          <button
            onclick="d_none('overlayEdit'), openEditOverlay(${index}), openEditContact()"
          >
            <img src="../assets/icons/contacts/edit.svg" alt="Edit Symbol" />
            <p class="weight400 size16 colorDarkBlue">Edit</p>
          </button>
          <button onclick="deleteContact('contacts/${contacts[index].id}')">
            <img
              src="../assets/icons/contacts/delete.svg"
              alt="Delete Symbol"
            />
            <p class="weight400 size16 colorDarkBlue">Delete</p>
          </button>
        </div>
      </div>
      <div
        class="openContactMenu"
        onclick="toggleStyleChange('editButtonsPosition', 'editButtonsPosition', 'editButtonsPositionOpen'), noBubble(event)"
      >
        <button>
          <img
            src="../assets/icons/contacts/Menu_Contact_options.svg"
            alt="Open Menu Button"
          />
        </button>
      </div>
    </div>
  `;
}

function detailsContactInsert(contact) {
  return `
    <p class="weight700 size16">Email</p>
    <a class="weight400 size16 emailLink" href="mailto:${contact.email}"
      >${contact.email}</a
    >
    <p class="weight700 size16">Phone</p>
    <a class="weight400 size16 phoneLink" href="tel:${contact.phone}"
      >${contact.phone}</a
    >
  `;
}

function listContactsAddtask(id, name, colorId, currentUser) {
  let checked = selectedContactsIDs.includes(id) ? "checked" : "";

  return `
    <div id="focus-${id}">
      <li onclick="selectCheckBox('checkbox-${id}', '${id}', 'focus-${id}')">
        <input
          type="checkbox"
          id="checkbox-${id}"
          class="add-task-checkmark"
          value="${id}"
          ${checked}
          onclick="toggleCheckbox('${id}'), noBubble(event)"
        />
        <div
          class="background-contacts bg-contact-chechbox"
          style="background-color: ${bgcolors[colorId].rgba};"
        >
          ${getInitials(name)}
        </div>
        <p class="checkbox-name size20">
          ${name}${currentUser.name === name ? " (You)" : ""}
        </p>
      </li>
    </div>
  `;
}

function listAssingedContacts(name, colorId) {
  return /*html*/ `<div class="background-contacts bg-contact-chechbox" style="background-color: ${bgcolors[colorId].rgba};">${getInitials(name)}</div>`;
}

function editFormInsert(contact) {
  return `
    <div id="inputEditErrorName" class="">
      <input
        id="nameInputEdit"
        class="weight400 size20"
        type="text"
        required
        placeholder="Name"
        pattern="[A-Za-zÀ-ÖØ-öø-ÿ]{1,30} [A-Za-zÀ-ÖØ-öø-ÿ]{1,30}"
        value="${contact.name}"
      />
      <div class="contactError">
        <p id="editErrorName" class="size12 d_none">
          Please insert a name and a surname - e.g.: John Doe
        </p>
      </div>
    </div>

    <div id="inputEditErrorEmail" class="">
      <input
        id="mailInputEdit"
        class="weight400 size20"
        type="email"
        placeholder="Email"
        pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
        value="${contact.email}"
      />

      <div class="contactError">
        <p id="editErrorEmail" class="size12 d_none">
          Please insert a name and a surname - e.g.: John Doe
        </p>
      </div>
    </div>

    <div id="inputEditErrorTel" class="">
      <input
        id="telInputEdit"
        class="weight400 size20"
        type="tel"
        required
        placeholder="Phone"
        pattern="[0-9]{4,20}"
        value="${contact.phone}"
      />
      <div class="contactError">
        <p id="editErrorTel" class="size12 d_none">
          Please insert a name and a surname - e.g.: John Doe
        </p>
      </div>
    </div>
  `;
}

function editButtonsInsert(contact, index) {
  return `
    <button
      class="add-task-button-clear"
      onclick="deleteContact('contacts/${contact.id}'), d_none('overlayEdit'), clearInput('nameInputEdit', 'mailInputEdit', 'telInputEdit'), toggleStyleChange('editWindow', 'addContactWindowClosed', 'addContactWindow') "
    >
      Delete
    </button>
    <button
      class="add-task-button-create"
      onclick="editUser('nameInputEdit', 'mailInputEdit', 'telInputEdit', '${contact.id}', '${index}')"
    >
      Save<img src="../assets/icons/add_task/check-icon.svg" />
    </button>
  `;
}

function editInitialsInsert(contact) {
  return `
    <div class="background-contacts bg-details" style="background-color: ${bgcolors[contact.colorId].rgba};">
      ${getInitials(contact.name)}
    </div>
  `;
}

function listSubtasks(i, content) {
  return `
    <div class="list-item-container" id="list-item-container-${i}">
      <li
        class="subtask-list-items"
        id="listItem-${i}"
        contenteditable="false"
        onblur="updateListItem(${i})"
        onkeydown="handleEnter(event, ${i})"
      >
        ${content}
      </li>
      <div class="list-icons-wrapper">
        <div class="list-icons">
          <img
            src="../assets/icons/add_task/edit.svg"
            alt="Edit"
            class="edit-icon"
            onclick="editListItem('${i}')"
            id="editIcon-${i}"
          />
          <img
            src="../assets/icons/add_task/check-icon.svg"
            alt="Check"
            class="check-icon"
            onclick="updateListItem(${i})"
            id="checkIcon-${i}"
            style="display: none;"
          />
        </div>
        <div class="list-icon-seperator"></div>
        <div class="list-icons">
          <img
            src="../assets/icons/add_task/delete.svg"
            alt="Delete"
            onclick="deleteListItem(${i})"
          />
        </div>
      </div>
    </div>
  `;
}

function listTasks(task, i, category) {
  return `
    <div
      class="board-card"
      id="${task.id}"
      draggable="true"
      ondragstart="drag(event)"
      onclick="getTaskDetails(this.id), openUserStory()"
    >
      <div class="spaceBetween">
        <div class="crad-category size16 ${category}">${task.category}</div>
        <div class="boardChangeStatus">
          <button
            onclick="noBubble(event), d_none('mobileEditStatusPosition${task.id}')"
          >
            <img src="../assets/icons/board/plus button.svg" />
          </button>
          <div
            id="mobileEditStatusPosition${task.id}"
            class="mobileEditStatusPosition d_none"
            onclick="noBubble(event)"
          >
            <div class="mobileEditStatus">
              <p>Select Status:</p>
              <button onclick="changeMobileTaskStatus('${task.id}', 'todo')">
                To do
              </button>
              <button
                onclick="changeMobileTaskStatus('${task.id}', 'progress')"
              >
                In progress
              </button>
              <button
                onclick="changeMobileTaskStatus('${task.id}', 'feedback')"
              >
                Await feedback
              </button>
              <button onclick="changeMobileTaskStatus('${task.id}', 'done')">
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="card-title-discription">
        <p class="size16 weight700">${task.title}</p>
        <p class="size16 weight400 colorGrey">
          ${truncateText(task.description === undefined ? "" : task.description)}
        </p>
      </div>
      <div class="crad-subtask-wrapper" id="subtaskStatus-${i}">
        <div class="subtask-progressbar">
          <div class="subtask-progress" id="subtaskProgress-${i}"></div>
        </div>
        <p class="size12" id="subtaskDone-${i}"></p>
      </div>
      <div class="crad-footer">
        <div class="card-assignedto" id="cardContact-${i}"></div>
        <img src="../assets/icons/add_task/prio-${task.prio}-icon.svg" />
      </div>
    </div>
  `;
}

function listCardContacts(assignedName, assignedCode) {
  return /*html*/ `
          <div class="background-contacts card-contact-bg" style="background-color:${bgcolors[assignedCode].rgba};">${getInitials(assignedName)}</div>
          `;
}

function mobileFooterLoggedOut() {
  return `
  <div class="navbar-wrapper-footer logIn" onclick='changeNavbarItems("login")'>
        <button class="navbar-menu-button navbar-footer-button">
          <img src="../assets/icons/nav_bar/log-in.svg" />
        </button>
        <span>Log In</span>
      </div>


      <div id="loggedOutLinks">
        <div class="navbar-wrapper-footer loggedOutButtons" 
         onclick='changeNavbarItems("privacy_policy")'>
          <button class="navbar-menu-button navbar-footer-button">
            <span>Privacy Policy </span>
          </button>
        </div>

        <div class="navbar-wrapper-footer loggedOutButtons" onclick='changeNavbarItems("legal_notice")'>
          <button class="navbar-menu-button navbar-footer-button">
            <span>Legal Notice </span>
          </button>
        </div>
      </div>
  `;
}

function mobileFooterLoggedIn() {
  return `
<div
          class="navbar-wrapper-footer"
          onclick='changeNavbarItems("summary")'
        >
          <button class="navbar-menu-button navbar-footer-button">
            <img src="../assets/icons/nav_bar/summary-icon.svg" />
          </button>
          <span>Summary</span>
        </div>
        <div class="navbar-wrapper-footer" onclick='changeNavbarItems("board")'>
          <button class="navbar-menu-button navbar-footer-button">
            <img src="../assets/icons/nav_bar/board-icon.svg" />
          </button>
          <span>Board</span>
        </div>
        <div
          class="navbar-wrapper-footer"
          onclick='changeNavbarItems("addtask")'
        >
          <button class="navbar-menu-button navbar-footer-button">
            <img src="../assets/icons/nav_bar/addtask-icon.svg" />
          </button>
          <span>Add Task</span>
        </div>
        <div
          class="navbar-wrapper-footer"
          onclick='changeNavbarItems("contacts")'
        >
          <button class="navbar-menu-button navbar-footer-button">
            <img src="../assets/icons/nav_bar/contacts-icon.svg" />
          </button>
          <span>Contacts</span>
        </div>
`;
}

function desktopNavbarLoggedIn() {
  return `
         <div
            class="navbar-menu-button-wrapper"
            onclick='changeNavbarItems("summary")'
          >
            <button class="navbar-menu-button">
              <img src="../assets/icons/nav_bar/summary-icon.svg" />Summary
            </button>
          </div>
          <div
            class="navbar-menu-button-wrapper"
            onclick='changeNavbarItems("addtask")'
          >
            <button class="navbar-menu-button">
              <img src="../assets/icons/nav_bar/addtask-icon.svg" />Add Task
            </button>
          </div>
          <div
            class="navbar-menu-button-wrapper"
            onclick='changeNavbarItems("board")'
          >
            <button class="navbar-menu-button">
              <img src="../assets/icons/nav_bar/board-icon.svg" />Board
            </button>
          </div>
          <div
            class="navbar-menu-button-wrapper"
            onclick='changeNavbarItems("contacts")'
          >
            <button class="navbar-menu-button">
              <img src="../assets/icons/nav_bar/contacts-icon.svg" />Contacs
            </button>
          </div>
`;
}

function desktopNavbarLoggedOut() {
  return `
          <div
            class="navbar-menu-button-wrapper"
            onclick='changeNavbarItems("login")'
          >
            <button class="navbar-menu-button">
              <img src="../assets/icons/nav_bar/log-in.svg" />Log In
            </button>
          </div>
`;
}

function summaryDueDateInsert(closestDate, splitDay, splitYear) {
  return `
    <p class="weight700 size21">
      ${months[closestDate.getMonth()] + " " + splitDay + ", " + splitYear}
    </p>
    <p class="weight400 size16">Upcoming Deadline</p>
  `;
}

function noTaskMessage(status, id) {
  return /*html*/ `
  <div class="board-no-task size16" id="no-task-message-${id}">
  <p>No tasks in ${status}</p>
</div>`;
}
