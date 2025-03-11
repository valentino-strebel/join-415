/**
 * Determines the appropriate greeting ("Good morning", "Good afternoon", "Good evening")
 * based on current system time and updates greeting elements on the page.
 *
 * @function getTimeGreeting
 */
function getTimeGreeting() {
  const now = new Date();
  const hours = now.getHours();
  let greeting;
  if (hours >= 3 && hours < 12) {
    greeting = "Good morning,";
  } else if (hours >= 12 && hours < 18) {
    greeting = "Good afternoon,";
  } else {
    greeting = "Good evening,";
  }
  let content = document.getElementById("greeting");
  let contentMobile = document.getElementById("greeting-mobile");
  if (window.innerWidth < 960) {
    if (contentMobile) contentMobile.textContent = greeting;
  } else {
    if (content) content.textContent = greeting;
  }
}

/**
 * Get the initials of a name.
 * @param {string} name - The full name of the user.
 * @returns {string} The initials of the name in uppercase.
 */
function getInitials(name) {
 if(name) return name
    .split(" ")
    .map((word) => word[0].toUpperCase())
    .join("");
}

/**
 * Fetches the current user data from the API.
 * @param {number|string} id - User ID (currently unused).
 * @param {string} [path="current-user"] - API endpoint path.
 * @returns {Promise<void>}
 */
async function getCurrentUser(id, path = "current-user") {
  let response = await fetch(`${BASE_URL}${path}.json`);
  currentUser = await response.json();
}

/**
 * Loads the current user data and renders their name and initials.
 * @param {number|string} id - The ID used to target the initials' element.
 * @returns {Promise<void>}
 */
async function loadCurrentUser(id) {
  await getCurrentUser();
  renderCurrentUser(currentUser);
  renderInitials(id, currentUser);
}

/**
 * Renders the current user's name in the appropriate element depending on screen size.
 * @param {Object} currentUser - The user object.
 * @param {string} currentUser.name - The full name of the user.
 */
function renderCurrentUser(currentUser) {
  let content = document.getElementById("user-name");
  let contentMobile = document.getElementById("user-name-mobile");

  if (window.innerWidth < 960) {
    if (contentMobile) contentMobile.innerHTML = currentUser.name;
  } else {
    if (content) content.innerHTML = currentUser.name;
  }
}

/**
 * Renders the initials of the current user in the header element.
 * @param {number|string} id - The ID suffix for the header element.
 * @param {Object} currentUser - The user object.
 * @param {string} currentUser.name - The full name of the user.
 */
function renderInitials(id, currentUser) {
  let content = document.getElementById(`header-initials-${id}`);
  content.innerHTML = getInitials(currentUser.name);
}

/**
 * Sorts an array of contact objects alphabetically by name.
 * @param {Object[]} contacts - The array of contact objects.
 * @param {string} contacts[].name - The name of the contact.
 * @returns {Object[]} Sorted array of contacts.
 */
function sortContacts(contacts) {
  return contacts.sort((a, b) =>
    a.name.localeCompare(b.name, "de", { sensitivity: "base" })
  );
}

/**
 * Checks if a user is currently logged in based on the presence of their name.
 * @returns {Promise<boolean>} Returns true if user is logged in, false otherwise.
 */
async function checkLoggedIn() {
  await getCurrentUser();
  return currentUser.name.length > 0;
}
