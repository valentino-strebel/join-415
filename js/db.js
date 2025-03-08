/**
 * Array to store tasks.
 * @type {Array<Object>}
 */
let tasks = [];

/**
 * Array to store subtasks.
 * @type {Array<Object>}
 */
let subtasks = [];

/**
 * Array to store input values for subtasks.
 * @type {Array<string>}
 */
let subtaskInputs = [];

/**
 * Array to store contacts.
 * @type {Array<Object>}
 */
let contacts = [];

/**
 * A unique key to identify tasks.
 * @type {number}
 */
let taskKey = 0;

/**
 * Array to store keys of assignees being edited.
 * @type {Array<number>}
 */
let assigneeEditKey = [];

/**
 * Array to store selected contact IDs.
 * @type {Array<number>}
 */
let selectedContactsIDs = [];

/**
 * Array to store selected assignees.
 * @type {Array<Object>}
 */
let selectedAssignee = [];

/**
 * Stores the priority level of a task.
 * @type {string}
 */
let newPrio = "";

/**
 * Array of urgency icons representing priority levels.
 * @type {Array<string>}
 */
let urgencySymbols = [
  "../assets/icons/add_task/prio-low-icon.svg",
  "../assets/icons/add_task/prio-medium-icon.svg",
  "../assets/icons/add_task/prio-urgent-icon.svg",
];

/**
 * Array of month names.
 * @type {Array<string>}
 */
let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/**
 * Array of background colors with ID and RGBA value.
 * @type {Array<{id: number, rgba: string}>}
 */
let bgcolors = [
  { id: 0, rgba: "rgba(255, 105, 135, 1)" },
  { id: 1, rgba: "rgba(255, 180, 120, 1)" },
  { id: 2, rgba: "rgba(186, 85, 211, 1)" },
  { id: 3, rgba: "rgba(100, 200, 250, 1)" },
  { id: 4, rgba: "rgba(60, 179, 113, 1)" },
  { id: 5, rgba: "rgb(153, 197, 43)" },
  { id: 6, rgba: "rgba(218, 165, 32, 1)" },
  { id: 7, rgba: "rgb(205, 127, 224)" },
  { id: 8, rgba: "rgba(138, 43, 226, 1)" },
  { id: 9, rgba: "rgba(255, 165, 0, 1)" },
];

/**
 * Array of tag colors in RGBA format.
 * @type {Array<string>}
 */
let tagColors = ["rgba(0, 56, 255, 1)", "rgba(31, 215, 193, 1)"];
/**
 * Loads necessary data when `board.html` is opened.
 * Fetches contacts and tasks, then renders them.
 * Also initializes the minimum selectable date.
 * @async
 * @returns {Promise<void>}
 */
async function loadDataBoard() {
  await getContacts();
  await getTasks();
  renderTasks();
  renderContacts(contacts, "contacts-checkbox");
  minDate("date");
}

/**
 * Loads necessary data when `contacts.html` is opened.
 * Fetches and sorts contacts.
 * @async
 * @returns {Promise<void>}
 */
async function loadDataContacts() {
  await getContacts();
  orderContactsBoard();
}

/**
 * Loads necessary data when `summary.html` is opened.
 * Fetches contacts and tasks, then updates the task summary.
 * @async
 * @returns {Promise<void>}
 */
async function loadDataSummary() {
  await getContacts();
  await getTasks();
  showTaskNumbers();
}

/**
 * Loads necessary data when `addtask.html` is opened.
 * Fetches contacts, renders them, and sets default values.
 * Initializes button color and date selection.
 * @async
 * @returns {Promise<void>}
 */
async function loadDataAddTask() {
  await getContacts();
  renderContacts(contacts, "contacts-checkbox");
  setButtonColor("Medium", "#FFA800");
  minDate("date");
}
/**
 * Fetches contacts from the Firebase database.
 * Retrieves and processes contact data, storing it in the `contacts` array.
 * If data is available, it maps each contact to an object containing relevant details.
 *
 * @async
 * @param {string} [path="contacts/"] - The Firebase path to fetch contacts from.
 * @returns {Promise<void>} Resolves when contacts are successfully retrieved and stored.
 */
async function getContacts(path = `contacts/`) {
  contacts = [];
  let response = await fetch(BASE_URL + path + ".json");
  let contactData = await response.json();
  if (contactData != 0) {
    Object.entries(contactData).forEach(([id, details]) => {
      contacts.push({
        id: id,
        name: details.name,
        email: details.email,
        phone: details.phone,
        colorId: details.colorId,
        initials: getInitials(details.name),
      });
    });
  }
}
/**
 * Asynchronously retrieves task data from Firebase via API and processes it.
 *
 * @async
 * @function getTasks
 * @param {string} [path="tasks/"] - The endpoint path to fetch tasks from Firebase.
 * @returns {Promise<void>} - A promise that resolves when task data is fetched and processed.
 */
async function getTasks(path = `tasks/`) {
  tasks = [];
  let response = await fetch(BASE_URL + path + ".json");
  let tasksData = await response.json();
  if (tasksData != null) {
    Object.entries(tasksData).forEach(([id, content]) => {
      let subtasksArray = [];
      if (content.subtask) {
        subtasksArray = Object.entries(content.subtask)
          .filter(([key, value]) => value !== null && value !== undefined)
          .map(([subtaskId, subtaskContent]) => ({
            id: subtaskId,
            checked: subtaskContent.checked,
            text: subtaskContent.text,
          }));
      }
      let contactArray = [];
      if (content.contact) {
        contactArray = Object.entries(content.contact)
          .filter(([key, value]) => value !== null && value !== undefined)
          .map(([assigneeId, assigneeContent]) => ({
            "assigneeId": assigneeId,
            "mainContactId": assigneeContent.id,
          }));
      }
      tasksPush(tasks, id, content, subtasksArray, contactArray);
    });
  }
}

/**
 * Pushes task data into the main tasks array.
 *
 * @function tasksPush
 * @param {Array<Object>} tasks - The main tasks array.
 * @param {string} id - The task ID.
 * @param {Object} content - The task content object.
 * @param {Array<Object>} subtasksArray - The processed array of subtasks.
 * @param {Array<Object>} contactArray - The processed array of assigned contacts.
 */
function tasksPush(tasks, id, content, subtasksArray, contactArray) {
  tasks.push({
    id: id,
    status: content.status,
    category: content.category,
    title: content.title,
    description: content.description,
    subtasks: subtasksArray,
    assigned: contactArray,
    prio: content.prio,
    date: content.date,
  });
}
