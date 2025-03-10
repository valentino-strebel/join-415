/**
 * Base URL for the Firebase database.
 * @constant {string}
 */
const BASE_URL =
  "https://join-415-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Media query to detect viewport width below 960px.
 * @constant {MediaQueryList}
 */
let media = window.matchMedia("(max-width: 960px)");

/**
 * Holds the current user object.
 * @type {Object|null}
 */
let currentUser = null;

/**
 * Handles loading and initializing different parts of the page based on the given id.
 * @param {string} id - The identifier of the page to load (e.g., "contacts", "addtask", "board", "summary").
 * @returns {Promise<void>}
 */
async function pageLoadHandler(id) {
  mediaQuery();
  getTimeGreeting();
  await loadCurrentUser(id);
  if (id === "contacts") loadDataContacts();
  if (id === "addtask") loadDataAddTask();
  if (id === "board") loadDataBoard();
  if (id === "summary") loadDataSummary();
}

/**
 * Toggles the 'd_none' class to show or hide an element.
 * @param {string} enterid - The ID of the element to toggle.
 */
function d_none(enterid) {
  document.getElementById(enterid).classList.toggle("d_none");
}

/**
 * Stops the propagation of an event, preventing it from bubbling up the DOM tree.
 * @param {Event} event - The event object.
 */
function noBubble(event) {
  event.stopPropagation();
}

/**
 * Prevents the default action of an event.
 * @param {Event} event - The event object.
 */
function prevent(event) {
  event.preventDefault();
}

/**
 * Navigates to a different HTML page based on the provided ID.
 * @param {string} id - The ID of the target page (without file extension).
 */
function changeNavbarItems(id) {
  window.location.href = `../html/${id}.html`;
}

/**
 * Opens the Help page.
 */
function openHelp() {
  window.location.href = "../html/help.html";
}

/**
 * Opens the Login page.
 */
function openLoginHTML() {
  window.location.href = "./html/login.html";
}

/**
 * Logs out the current user and redirects to the login page.
 * @returns {Promise<void>}
 */
async function logOut() {
  let user = { name: "" };
  await edit_data("/current-user", user);
  changeNavbarItems("login");
}

/**
 * Opens the Sign-Up page.
 */
function openSignUpHTML() {
  window.location.href = "../html/signup.html";
}

/**
 * Opens the Summary page.
 */
function openSummary() {
  window.location.href = "../html/summary.html";
}

/**
 * Opens the Legal Notice page.
 */
function openLegalNotice() {
  window.location.href = "../html/legal_notice.html";
}

/**
 * Opens the Privacy Policy page.
 */
function openPrivacyPolicy() {
  window.location.href = "../html/privacy_policy.html";
}

/**
 * Opens the Add Task page or overlay depending on screen size.
 * @param {string} status - The status for the task to be added.
 */
function openAddTask(status) {
  if (window.innerWidth < 960) {
    window.location.href = "../html/addtask.html";
  } else {
    openAddTaskOverlay(status);
  }
}

/**
 * Triggers a greeting animation and changes navbar items based on screen width.
 * If the screen width is less than 960px, delays navbar change for 2.9 seconds.
 */
function greetingAnimation() {
  if (window.innerWidth < 960) {
    setTimeout(() => {
      changeNavbarItems("summary");
    }, 2900);
  } else {
    changeNavbarItems("summary");
  }
}

/**
 * Sends a POST request to the given path with the provided data to create new data.
 *
 * @async
 * @param {string} path - The API endpoint path (without ".json").
 * @param {Object} data - The data to be sent in the request body.
 * @returns {Promise<Object>} - The response data as a JSON object.
 * @throws {Error} - Throws error if HTTP request fails.
 */
async function update_data(path = "", data = {}) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

/**
 * Sends a DELETE request to the given path to delete data.
 *
 * @async
 * @param {string} path - The API endpoint path (without ".json").
 * @returns {Promise<Object>} - The response data as a JSON object.
 */
async function delete_data(path) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "DELETE",
  });
  return await response.json();
}

/**
 * Sends a PUT request to replace data at the given path with provided data.
 *
 * @async
 * @param {string} path - The API endpoint path (without ".json").
 * @param {Object} data - The new data to be saved.
 * @returns {Promise<Object>} - The response data as a JSON object.
 */
async function edit_data(path = "", data = {}) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "PUT",
    header: { "Content-Type": "application/json" }, // Note: should be "headers"
    body: JSON.stringify(data),
  });
  return await response.json();
}

/**
 * Sends a PATCH request to update part of the data at the given path.
 *
 * @async
 * @param {string} path - The API endpoint path (without ".json").
 * @param {Object} data - Partial data to update.
 * @returns {Promise<Object>} - The response data as a JSON object.
 */
async function patch_data(path = "", data = {}) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "PATCH",
    header: { "Content-Type": "application/json" }, // Note: should be "headers"
    body: JSON.stringify(data),
  });
  return await response.json();
}

/**
 * Manages responsive design adjustments based on media query.
 * Shows/hides header, footer, kanban, help, and logo elements depending on screen width.
 */
function mediaQuery() {
  let header = document.getElementsByClassName("navbar");
  let footer = document.getElementsByClassName("footer_nav");
  let kanban = document.getElementsByClassName("kanban");
  let help = document.getElementsByClassName("help");
  let logo = document.getElementsByClassName("join-mobile-logo");
  mediaQueryFunctionsExec();
  mediaQueryDNone(header, footer, kanban, help, logo);
}

/**
 * Executes a set of functions to adjust layout and behavior for responsive views.
 */
function mediaQueryFunctionsExec() {
  loginMedia();
  summaryMedia();
  boardMedia();
  mobileIntro();
}

/**
 * Adds or removes "d_none" class from elements based on media query match.
 *
 * @param {HTMLCollection} header - Navbar elements.
 * @param {HTMLCollection} footer - Footer elements.
 * @param {HTMLCollection} kanban - Kanban board elements.
 * @param {HTMLCollection} help - Help elements.
 * @param {HTMLCollection} logo - Mobile logo elements.
 */
function mediaQueryDNone(header, footer, kanban, help, logo) {
  if (media.matches) {
    Array.from(header).forEach((el) => el.classList.add("d_none"));
    Array.from(footer).forEach((el) => el.classList.remove("d_none"));
    Array.from(kanban).forEach((el) => el.classList.add("d_none"));
    Array.from(help).forEach((el) => el.classList.add("d_none"));
    Array.from(logo).forEach((el) => el.classList.remove("d_none"));
  } else {
    Array.from(header).forEach((el) => el.classList.remove("d_none"));
    Array.from(footer).forEach((el) => el.classList.add("d_none"));
    Array.from(kanban).forEach((el) => el.classList.remove("d_none"));
    Array.from(help).forEach((el) => el.classList.remove("d_none"));
    Array.from(logo).forEach((el) => el.classList.add("d_none"));
  }
}

/**
 * Toggles between mobile and desktop "join" views based on media query match.
 * Also updates intro background color and triggers transition effect.
 *
 * @function mobileIntro
 */
function mobileIntro() {
  let joinDesktop = document.getElementById("join-home");
  let joinMobile = document.getElementById("join-mobile-intro");
  let introBody = document.getElementById("intro-body");
  if (media.matches) {
    if (joinDesktop) joinDesktop.classList.add("d_none");
    if (joinMobile) joinMobile.classList.remove("d_none");
  } else {
    if (joinDesktop) joinDesktop.classList.remove("d_none");
    if (joinMobile) joinMobile.classList.add("d_none");
  }
  setTimeout(() => {
    if (introBody) introBody.style.backgroundColor = "white";
    if (joinMobile) joinMobile.classList.add("transition-active");
  }, 0);
}

/**
 * Toggles between showing the welcome dashboard or help menu
 * depending on whether the screen is mobile or desktop size.
 *
 * @function summaryMedia
 */
function summaryMedia() {
  let welcome = document.getElementById("welcome-dash");
  let helpMenu = document.getElementById("help-menu");
  if (media.matches) {
    if (welcome) welcome.classList.add("d_none");
    if (helpMenu) helpMenu.classList.remove("d_none");
  } else {
    if (welcome) welcome.classList.remove("d_none");
    if (helpMenu) helpMenu.classList.add("d_none");
  }
}

/**
 * Controls visibility of search bar and add task button
 * depending on screen size (mobile or desktop).
 *
 * @function boardMedia
 */
function boardMedia() {
  let boardSearch = document.getElementById("board-search-container");
  let mobileSearch = document.getElementById("mobile-board-search");
  let addTaskSpan = document.getElementById("addtask-span");
  if (media.matches) {
    if (addTaskSpan) addTaskSpan.classList.add("d_none");
  } else {
    if (addTaskSpan) addTaskSpan.classList.remove("d_none");
  }
}

/**
 * Switches between mobile and desktop "no user" views
 * depending on screen size (media query).
 *
 * @function loginMedia
 */
function loginMedia() {
  let noUser = document.getElementById("no-user-container");
  let noUserMobile = document.getElementById("no-user-container-mobile");

  if (media.matches) {
    if (noUser) noUser.classList.add("d_none");
    if (noUserMobile) noUserMobile.classList.remove("d_none");
  } else {
    if (noUser) noUser.classList.remove("d_none");
    if (noUserMobile) noUserMobile.classList.add("d_none");
  }
}

/**
 * Initializes media query handling and sets up event listener
 * for dynamic changes in screen size.
 *
 * @function mediaQuery
 * @event mediaQuery@change - Executes media query dependent functions when screen size changes.
 */
mediaQuery();
media.addEventListener("change", mediaQuery);

/**
 * Changes the navigation bar style and visibility based on user's login status.
 * @param {number} styleID - The index for the style element to modify.
 * @returns {Promise<void>}
 */
async function changeNavbar(styleID) {
  let styleDiv = document.getElementsByClassName("loggedOutButtons");
  let desktopID = document.getElementById("desktop-nav");
  let footerID = document.getElementById("mobile-footer");
  let profile = document.getElementsByClassName("profileSection");
  let help = document.getElementsByClassName("help");
  footerID.innerHTML = "";
  desktopID.innerHTML = "";
  changeNavbarExecute(styleDiv, desktopID, footerID, profile, help, styleID);
}

/**
 * Executes the navigation bar changes based on user's login status.
 * @param {HTMLCollectionOf<Element>} styleDiv - Collection of style elements for logged out buttons.
 * @param {HTMLElement} desktopID - Desktop navigation container element.
 * @param {HTMLElement} footerID - Mobile footer container element.
 * @param {HTMLCollectionOf<Element>} profile - Collection of profile section elements.
 * @param {HTMLCollectionOf<Element>} help - Collection of help section elements.
 * @param {number} styleID - The index for the style element to modify.
 * @returns {Promise<void>}
 */
async function changeNavbarExecute(
  styleDiv,
  desktopID,
  footerID,
  profile,
  help,
  styleID
) {
  if (await checkLoggedIn()) {
    footerID.innerHTML = mobileFooterLoggedIn();
    desktopID.innerHTML = desktopNavbarLoggedIn();
    for (let index = 0; index < profile.length; index++) {
      profile[index].classList.remove("d_none");
      help[index].classList.add("d_none");
    }
  } else {
    desktopID.innerHTML = desktopNavbarLoggedOut();
    footerID.innerHTML = mobileFooterLoggedOut();
    styleDiv[styleID].style.backgroundColor = "rgba(9, 25, 49, 1)";
    for (let index = 0; index < profile.length; index++) {
      profile[index].classList.add("d_none");
    }
  }
}
