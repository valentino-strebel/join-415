function hideDetails(windowId, styleA, styleB) {
  if (document.getElementById(windowId).classList == "contactsDisplay detailsWindow") {
    toggleStyleChange(windowId, styleA, styleB);
  }
}

async function contactNoAction(windowId, styleA, styleB, styleC) {
  toggleStyleChange(windowId, styleA, styleC);
  await delay(0.1);
  toggleStyleChange(windowId, styleC, styleB);
  document.body.style.overflow = "";
}

async function delay(seconds) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

async function showCreationHint(windowId, styleA, styleB) {
  toggleStyleChange(windowId, styleA, styleB);
  await delay(3);
  toggleStyleChange(windowId, styleA, styleB);
}

function mobileContactDetails(windowId, styleA, styleB) {
  if (window.innerWidth < 960) {
    toggleStyleChange(windowId, styleA, styleB);
  }
}

function changeMobileDesktop(windowId, styleA, styleB) {
  let windowWidth = window.innerWidth;
  let detailsClass = document.getElementById(windowId).classList;
  if (windowWidth >= 961 && detailsClass == styleA) {
    toggleStyleChange(windowId, styleA, styleB);
  }
}

function openAddContact() {
  let contactWindow = document.getElementById("contactWindow");
  let contactOverlay = document.getElementById("overlay");

  if (contactWindow) contactWindow.classList.remove("d_none");
  if (contactOverlay) contactOverlay.classList.remove("d_none");

  setTimeout(() => {
    toggleStyleChange("contactWindow", "addContactWindowClosed", "addContactWindow");
  }, 100);
}

function openEditContact() {
  let contactWindow = document.getElementById("editWindow");
  let contactOverlay = document.getElementById("overlay-edit");

  if (contactWindow) contactWindow.classList.remove("d_none");
  if (contactOverlay) contactOverlay.classList.remove("d_none");

  setTimeout(() => {
    toggleStyleChange("editWindow", "addContactWindowClosed", "addContactWindow");
  }, 100);
}

function closeAddContact() {
  let contactWindow = document.getElementById("contactWindow");
  let contactOverlay = document.getElementById("overlay");

  contactNoAction("contactWindow", "addContactWindowClosed", "addContactWindow", "addContactWindowNoAction");

  setTimeout(() => {
    if (contactWindow) contactWindow.classList.add("d_none");
    if (contactOverlay) contactOverlay.classList.add("d_none");
  }, 100);
}

function closeEditContact() {
  let contactWindow = document.getElementById("editWindow");
  let contactOverlay = document.getElementById("overlay-edit");

  contactNoAction("editWindow", "addContactWindowClosed", "addContactWindow", "addContactWindowNoAction");

  setTimeout(() => {
    if (contactWindow) contactWindow.classList.add("d_none");
    if (contactOverlay) contactOverlay.classList.add("d_none");
  }, 100);
}

function closeEditContactSave() {
  let contactWindow = document.getElementById("editWindow");
  let contactOverlay = document.getElementById("overlay-edit");

  toggleStyleChange("editWindow", "addContactWindowClosed", "addContactWindow");

  setTimeout(() => {
    if (contactWindow) contactWindow.classList.add("d_none");
    if (contactOverlay) contactOverlay.classList.add("d_none");
  }, 100);
}

function closeAddContactSuccess() {
  let contactWindow = document.getElementById("contactWindow");
  let contactOverlay = document.getElementById("overlay");

  setTimeout(() => {
    if (contactWindow) contactWindow.classList.add("d_none");
    if (contactOverlay) contactOverlay.classList.add("d_none");
  }, 100);
}
