/**
 * Hides the details window if it matches the specified class.
 * @param {string} windowId - The ID of the window element.
 * @param {string} styleA - The initial style class.
 * @param {string} styleB - The alternative style class.
 */
function hideDetails(windowId, styleA, styleB) {
  if (
    document.getElementById(windowId).classList ==
    "contactsDisplay detailsWindow"
  ) {
    toggleStyleChange(windowId, styleA, styleB);
  }
}

/**
 * Performs a sequence of style changes with a delay.
 * @param {string} windowId - The ID of the window element.
 * @param {string} styleA - The initial style class.
 * @param {string} styleB - The final style class.
 * @param {string} styleC - An intermediate style class.
 */
async function contactNoAction(windowId, styleA, styleB, styleC) {
  toggleStyleChange(windowId, styleA, styleC);
  await delay(0.1);
  toggleStyleChange(windowId, styleC, styleB);
  document.body.style.overflow = "";
}

/**
 * Delays execution for a given number of seconds.
 * @param {number} seconds - The number of seconds to delay.
 * @returns {Promise<void>} A promise that resolves after the delay.
 */
async function delay(seconds) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

/**
 * Shows a creation hint temporarily before reverting the style.
 * @param {string} windowId - The ID of the window element.
 * @param {string} styleA - The initial style class.
 * @param {string} styleB - The alternative style class.
 */
async function showCreationHint(windowId, styleA, styleB) {
  toggleStyleChange(windowId, styleA, styleB);
  await delay(3);
  toggleStyleChange(windowId, styleA, styleB);
}

/**
 * Toggles the style change for contact details on mobile view.
 * @param {string} windowId - The ID of the window element.
 * @param {string} styleA - The initial style class.
 * @param {string} styleB - The alternative style class.
 */
function mobileContactDetails(windowId, styleA, styleB) {
  if (window.innerWidth < 960) {
    toggleStyleChange(windowId, styleA, styleB);
  }
}

/**
 * Changes styles based on screen width for mobile and desktop views.
 * @param {string} windowId - The ID of the window element.
 * @param {string} styleA - The initial style class.
 * @param {string} styleB - The alternative style class.
 */
function changeMobileDesktop(windowId, styleA, styleB) {
  let windowWidth = window.innerWidth;
  let detailsClass = document.getElementById(windowId).classList;
  if (windowWidth >= 961 && detailsClass == styleA) {
    toggleStyleChange(windowId, styleA, styleB);
  }
}

/**
 * Opens the add contact window and overlay.
 */
function openAddContact() {
  let contactWindow = document.getElementById("contactWindow");
  let contactOverlay = document.getElementById("overlay");

  if (contactWindow) contactWindow.classList.remove("d_none");
  if (contactOverlay) contactOverlay.classList.remove("d_none");

  setTimeout(() => {
    toggleStyleChange(
      "contactWindow",
      "addContactWindowClosed",
      "addContactWindow"
    );
  }, 100);
}

/**
 * Opens the edit contact window and overlay.
 */
function openEditContact() {
  let contactWindow = document.getElementById("editWindow");
  let contactOverlay = document.getElementById("overlay-edit");

  if (contactWindow) contactWindow.classList.remove("d_none");
  if (contactOverlay) contactOverlay.classList.remove("d_none");

  setTimeout(() => {
    toggleStyleChange(
      "editWindow",
      "addContactWindowClosed",
      "addContactWindow"
    );
  }, 100);
}

/**
 * Closes the add contact window and overlay with an animation.
 */
function closeAddContact() {
  let contactWindow = document.getElementById("contactWindow");
  let contactOverlay = document.getElementById("overlay");

  contactNoAction(
    "contactWindow",
    "addContactWindowClosed",
    "addContactWindow",
    "addContactWindowNoAction"
  );

  setTimeout(() => {
    if (contactWindow) contactWindow.classList.add("d_none");
    if (contactOverlay) contactOverlay.classList.add("d_none");
  }, 100);
}

/**
 * Closes the edit contact window and overlay with an animation.
 */
function closeEditContact() {
  let contactWindow = document.getElementById("editWindow");
  let contactOverlay = document.getElementById("overlay-edit");

  contactNoAction(
    "editWindow",
    "addContactWindowClosed",
    "addContactWindow",
    "addContactWindowNoAction"
  );

  setTimeout(() => {
    if (contactWindow) contactWindow.classList.add("d_none");
    if (contactOverlay) contactOverlay.classList.add("d_none");
  }, 100);
}

/**
 * Closes the edit contact window after saving.
 */
function closeEditContactSave() {
  let contactWindow = document.getElementById("editWindow");
  let contactOverlay = document.getElementById("overlay-edit");

  toggleStyleChange("editWindow", "addContactWindowClosed", "addContactWindow");

  setTimeout(() => {
    if (contactWindow) contactWindow.classList.add("d_none");
    if (contactOverlay) contactOverlay.classList.add("d_none");
  }, 100);
}

/**
 * Closes the add contact window upon successful addition.
 */
function closeAddContactSuccess() {
  let contactWindow = document.getElementById("contactWindow");
  let contactOverlay = document.getElementById("overlay");

  setTimeout(() => {
    if (contactWindow) contactWindow.classList.add("d_none");
    if (contactOverlay) contactOverlay.classList.add("d_none");
  }, 100);
}

function hideScrollbar(tagName) {
  let thisTag = document.getElementsByTagName(tagName)[0];
  if (thisTag.classList != "overflowHidden") {
    thisTag.classList.toggle("overflowHidden");
  }
}

function reinstateScrollbar(tagName) {
  let thisTag = document.getElementsByTagName(tagName)[0];
  if (thisTag.classList == "overflowHidden") {
    thisTag.classList.toggle("overflowHidden");
  }
}
