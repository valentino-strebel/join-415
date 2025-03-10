/**
 * Generates the header for a contact list section based on the given letter.
 * @param {string} letter - The letter representing the contact section.
 * @returns {string} - The HTML string for the contact header.
 */
function listContactHeader(letter) {
  return `
    <div class="contactsHeader size20"><p>${letter}</p></div>
    <div class="contactsSeperator"></div>
  `;
}

/**
 * Generates the HTML for a single contact entry.
 * @param {Object} contact - The contact object containing name, email, and color ID.
 * @param {number} index - The index of the contact in the contact list.
 * @param {Object} currentUser - The current user object.
 * @returns {string} - The HTML string for a contact entry.
 */
function listContactData(contact, index, currentUser) {
  return `
    <div
      class="contactsContainer"
      tabindex="0"
      onclick="hideScrollbar('body'), mobileContactDetails('contactsDetailsMobile', 'contactsDetails', 'contactsDetailsOpen'), openContactDetails(${index}), showContactDetails('contactsDisplay', 'detailsWindowClosed', 'detailsWindow'), noBubble(event)"
    >
      <div class="background-contacts" style="background-color: ${
        bgcolors[contact.colorId].rgba
      };">
        ${getInitials(contact.name)}
      </div>
      <div class="contactsContainerUserinfo">
        <p class="weight400 size20">${contact.name}${
    currentUser.name === contact.name ? " (You)" : ""
  }</p>
        <a class="weight400 size16 emailLink">${contact.email}</a>
      </div>
    </div>
  `;
}

/**
 * Generates the profile details for a contact.
 * @param {Object} contact - The contact object containing name and color ID.
 * @param {number} index - The index of the contact in the contact list.
 * @returns {string} - The HTML string for contact profile details.
 */
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

/**
 * Generates the contact details (email and phone) for a contact.
 * @param {Object} contact - The contact object containing email and phone.
 * @returns {string} - The HTML string for contact details.
 */
function detailsContactInsert(contact) {
  return `
    <p class="weight700 size16">Email</p>
    <a class="weight400 size16 emailLink" href="mailto:${contact.email}">
      ${contact.email}
    </a>
    <p class="weight700 size16">Phone</p>
    <a class="weight400 size16 phoneLink" href="tel:${contact.phone}">
      ${contact.phone}
    </a>
  `;
}
/**
 * Generates an HTML string for displaying a contact in the task list.
 *
 * @param {string} id - The unique identifier of the contact.
 * @param {string} name - The name of the contact.
 * @param {number} colorId - The ID corresponding to the contact's assigned background color.
 * @param {Object} currentUser - The current user object.
 * @param {string} currentUser.name - The name of the current user.
 * @returns {string} - The generated HTML string for the contact entry.
 */
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

/**
 * Generates an HTML string for displaying an assigned contact's initials.
 *
 * @param {string} name - The name of the assigned contact.
 * @param {number} colorId - The ID corresponding to the contact's assigned background color.
 * @returns {string} - The generated HTML string for the assigned contact.
 */
function listAssingedContacts(name, colorId) {
  return `<div class="background-contacts bg-contact-chechbox" style="background-color: ${
    bgcolors[colorId].rgba
  };">${getInitials(name)}</div>`;
}

/**
 * Generates an HTML form for editing a contact's information.
 *
 * @param {Object} contact - The contact object.
 * @param {string} contact.name - The name of the contact.
 * @param {string} contact.email - The email of the contact.
 * @param {string} contact.phone - The phone number of the contact.
 * @returns {string} - The generated HTML string for the edit form.
 */
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
        value="${contact.name}" />
      <div class="contactError">
        <p id="editErrorName" class="size12 d_none">Please insert a name and a surname - e.g.: John Doe</p>
      </div>
    </div>

    <div id="inputEditErrorEmail" class="">
      <input id="mailInputEdit" class="weight400 size20" type="email" placeholder="Email" pattern="^[^s@]+@[^s@]+.[^s@]+$" value="${contact.email}" />
      <div class="contactError">
        <p id="editErrorEmail" class="size12 d_none">Please insert a valid email - e.g.: name@email.com</p>
      </div>
    </div>

    <div id="inputEditErrorTel" class="">
      <input id="telInputEdit" class="weight400 size20" type="tel" required placeholder="Phone" pattern="[0-9]{4,20}" value="${contact.phone}" />
      <div class="contactError">
        <p id="editErrorTel" class="size12 d_none">Please insert a valid number - at least 4 characters</p>
      </div>
    </div>
  `;
}

/**
 * Generates HTML buttons for editing a contact.
 *
 * @param {Object} contact - The contact object.
 * @param {string} contact.id - The unique identifier of the contact.
 * @param {number} index - The index of the contact in the list.
 * @returns {string} - The generated HTML string for the edit and delete buttons.
 */
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

/**
 * Generates an HTML string for displaying a contact's initials in the edit view.
 *
 * @param {Object} contact - The contact object.
 * @param {string} contact.name - The name of the contact.
 * @param {number} contact.colorId - The ID corresponding to the contact's assigned background color.
 * @returns {string} - The generated HTML string for displaying the initials.
 */
function editInitialsInsert(contact) {
  return `
    <div class="background-contacts bg-details" style="background-color: ${
      bgcolors[contact.colorId].rgba
    };">
      ${getInitials(contact.name)}
    </div>
  `;
}
/**
 * Generates HTML markup for a subtask list item.
 *
 * @param {number} i - The index of the subtask item.
 * @param {string} content - The content of the subtask item.
 * @returns {string} - The HTML string representing the subtask item.
 */
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

/**
 * Generates HTML markup for a task card.
 *
 * @param {Object} task - The task object.
 * @param {string} task.id - The unique identifier of the task.
 * @param {string} task.category - The category of the task.
 * @param {string} task.title - The title of the task.
 * @param {string} [task.description] - The description of the task.
 * @param {string} task.prio - The priority of the task (e.g., high, medium, low).
 * @param {number} i - The index of the task.
 * @param {string} category - The category class for styling purposes.
 * @returns {string} - The HTML string representing the task card.
 */
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
            onclick="noBubble(event), d_none('mobileEditStatusPosition${
              task.id
            }')"
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
          ${truncateText(
            task.description === undefined ? "" : task.description
          )}
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

/**
 * Generates HTML markup for a contact badge in a task card.
 *
 * @param {string} assignedName - The name of the assigned person.
 * @param {string} assignedCode - The code used to determine the background color.
 * @returns {string} - The HTML string representing the contact badge.
 */
function listCardContacts(assignedName, assignedCode) {
  return ` 
  <div class="background-contacts card-contact-bg" style="background-color:${
    bgcolors[assignedCode].rgba
  };">${getInitials(assignedName)}</div> 
  `;
}
/**
 * Generates the HTML for the mobile footer when the user is logged out.
 *
 * @returns {string} HTML string for the logged-out mobile footer.
 */
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

/**
 * Generates the HTML for the mobile footer when the user is logged in.
 *
 * @returns {string} HTML string for the logged-in mobile footer.
 */
function mobileFooterLoggedIn() {
  return `
<div class="navbar-wrapper-footer" onclick='changeNavbarItems("summary")'>
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
<div class="navbar-wrapper-footer" onclick='changeNavbarItems("addtask")'>
  <button class="navbar-menu-button navbar-footer-button">
    <img src="../assets/icons/nav_bar/addtask-icon.svg" />
  </button>
  <span>Add Task</span>
</div>
<div class="navbar-wrapper-footer" onclick='changeNavbarItems("contacts")'>
  <button class="navbar-menu-button navbar-footer-button">
    <img src="../assets/icons/nav_bar/contacts-icon.svg" />
  </button>
  <span>Contacts</span>
</div>
`;
}

/**
 * Generates the HTML for the desktop navbar when the user is logged in.
 *
 * @returns {string} HTML string for the logged-in desktop navbar.
 */
function desktopNavbarLoggedIn() {
  return `
    <div class="navbar-menu-button-wrapper" onclick='changeNavbarItems("summary")'>
      <button class="navbar-menu-button">
        <img src="../assets/icons/nav_bar/summary-icon.svg" />Summary
      </button>
    </div>
    <div class="navbar-menu-button-wrapper" onclick='changeNavbarItems("addtask")'>
      <button class="navbar-menu-button">
        <img src="../assets/icons/nav_bar/addtask-icon.svg" />Add Task
      </button>
    </div>
    <div class="navbar-menu-button-wrapper" onclick='changeNavbarItems("board")'>
      <button class="navbar-menu-button">
        <img src="../assets/icons/nav_bar/board-icon.svg" />Board
      </button>
    </div>
    <div class="navbar-menu-button-wrapper" onclick='changeNavbarItems("contacts")'>
      <button class="navbar-menu-button">
        <img src="../assets/icons/nav_bar/contacts-icon.svg" />Contacts
      </button>
    </div>
  `;
}

/**
 * Generates the HTML for the desktop navbar when the user is logged out.
 *
 * @returns {string} HTML string for the logged-out desktop navbar.
 */
function desktopNavbarLoggedOut() {
  return `
    <div class="navbar-menu-button-wrapper" onclick='changeNavbarItems("login")'>
      <button class="navbar-menu-button">
        <img src="../assets/icons/nav_bar/log-in.svg" />Log In
      </button>
    </div>
  `;
}

/**
 * Generates an HTML snippet for displaying a due date in the summary.
 *
 * @param {Date} closestDate - The closest due date.
 * @param {string} splitDay - The day of the due date.
 * @param {string} splitYear - The year of the due date.
 * @returns {string} HTML string displaying the due date.
 */
function summaryDueDateInsert(closestDate, splitDay, splitYear) {
  return `
    <p class="weight700 size21">
      ${months[closestDate.getMonth()] + " " + splitDay + ", " + splitYear}
    </p>
    <p class="weight400 size16">Upcoming Deadline</p>
  `;
}

/**
 * Generates an HTML message when there are no tasks in a specific status.
 *
 * @param {string} status - The task status (e.g., "To Do", "In Progress").
 * @param {string} id - The unique ID for the message container.
 * @returns {string} HTML string displaying the no-task message.
 */
function noTaskMessage(status, id) {
  return `
  <div class="board-no-task size16" id="no-task-message-${id}">
    <p>No tasks in ${status}</p>
  </div>`;
}
