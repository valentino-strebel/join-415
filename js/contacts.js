/**
 * Stores the last contacted person.
 * @type {Array}
 */
let lastContact = [];

/**
 * Stores the edited contact details.
 * @type {Array}
 */
let editedContact = [];

/**
 * Orders contacts and groups them.
 */
function orderContactsBoard() {
  lastContact = [];
  lastContact = contacts[contacts.length - 1];
  groupContacts();
}

/**
 * Groups contacts alphabetically by the first letter of their name.
 */
async function groupContacts() {
  sortContacts(contacts);
  let grouped = {};
  for (let i = 0; i < contacts.length; i++) {
    let contact = contacts[i];
    let firstLetter = contact.name.charAt(0).toUpperCase();
    if (!grouped[firstLetter]) {
      grouped[firstLetter] = [];
    }
    grouped[firstLetter].push(contact);
  }
  let sortedGroups = Object.keys(grouped).sort();
  renderContacts(sortedGroups, grouped);
}

/**
 * Renders the sorted and grouped contacts in the UI.
 * @param {string[]} sortedGroups - Array of sorted letters representing groups.
 * @param {Object} grouped - Object containing contacts categorized by first letter.
 */
function renderContacts(sortedGroups, grouped) {
  let contactsListRef = document.getElementById("contactsList");
  let globalIndex = 0;
  contactsListRef.innerHTML = "";
  for (let i = 0; i < sortedGroups.length; i++) {
    let letter = sortedGroups[i];
    contactsListRef.innerHTML += listContactHeader(letter);
    for (let j = 0; j < grouped[letter].length; j++) {
      let contact = grouped[letter][j];
      contactsListRef.innerHTML += listContactData(contact, globalIndex, currentUser);
      globalIndex++;
    }
  }
}

/**
 * Opens and displays contact details.
 * @param {number} indexContacts - Index of the contact in the contacts list.
 */
function openContactDetails(indexContacts) {
  document.getElementById("detailsProfile").innerHTML = "";
  document.getElementById("detailsContact").innerHTML = "";
  let detailsMobile = document.getElementById("contactsDetailsMobile");
  let contact = contacts[indexContacts];
  detailsMobile.classList.remove("d_none");
  document.getElementById("detailsProfile").innerHTML = detailsProfileInsert(contact, indexContacts);
  document.getElementById("detailsContact").innerHTML = detailsContactInsert(contact);
}

/**
 * Retrieves and processes new contact data.
 * @param {string} inputName - ID of the name input field.
 * @param {string} inputEmail - ID of the email input field.
 * @param {string} inputPhone - ID of the phone input field.
 * @param {string} overId - Additional parameter for UI interactions.
 */
async function getContactData(inputName, inputEmail, inputPhone, overId) {
  if ([inputName, inputEmail, inputPhone].some((input, i) => [checkName, checkEmail, checkPhone][i](input))) {
    return;
  }
  await userCreateSuccess(inputName, inputEmail, inputPhone);
  await loadDataContacts();
  cleanWindow(inputName, inputEmail, inputPhone, overId);
  closeAddContactSuccess();
}

/**
 * Creates a new contact and updates the data source.
 * @param {string} inputName - ID of the name input field.
 * @param {string} inputEmail - ID of the email input field.
 * @param {string} inputPhone - ID of the phone input field.
 */
async function userCreateSuccess(inputName, inputEmail, inputPhone) {
  let name = document.getElementById(inputName).value.trim();
  let email = document.getElementById(inputEmail).value.trim();
  let phone = document.getElementById(inputPhone).value.trim();
  await update_data(
    (path = `contacts/`),
    (data = {
      name: name,
      email: email,
      phone: phone,
      colorId: getRandomNumber(),
    }),
  );
}

/**
 * Generates a random number between 0 and 9.
 * @returns {number} A random number.
 */
function getRandomNumber() {
  return Math.floor(Math.random() * 10);
}
/**
 * Clears input fields and updates UI for contact creation.
 * @param {string} inputName - The ID of the name input field.
 * @param {string} inputEmail - The ID of the email input field.
 * @param {string} inputPhone - The ID of the phone input field.
 * @param {string} overId - The ID of the overlay to hide.
 */
function cleanWindow(inputName, inputEmail, inputPhone, overId) {
  clearInput(inputName, inputEmail, inputPhone);
  d_none(overId);
  showCreationHint("createdInfo", "createdContactInfo", "createdContactInfoOut");
  toggleStyleChange("contactWindow", "addContactWindowClosed", "addContactWindow");
  showContactDetails("contactsDisplay", "detailsWindowClosed", "detailsWindow");
  findLastContactIndex();
}

/**
 * Finds and opens the details of the last added contact.
 */
function findLastContactIndex() {
  let lastId = lastContact.id;
  let myId = (item) => item.id == lastId;
  let foundId = contacts.findIndex(myId);
  openContactDetails(foundId);
}

/**
 * Finds and opens the details of an edited contact.
 * @param {string} editedContact - The ID of the edited contact.
 */
function findEditedContactIndex(editedContact) {
  let editedId = editedContact;
  let myId = (item) => item.id == editedId;
  let foundId = contacts.findIndex(myId);
  openContactDetails(foundId);
}

/**
 * Validates the provided name input against a predefined pattern.
 * @param {string} insertedName - The ID of the name input field.
 * @returns {boolean} - Returns true if the input is invalid.
 */
function checkName(insertedName) {
  let nameInput = document.getElementById(insertedName);
  let name = document.getElementById(insertedName).value.trim();
  let namePattern = new RegExp(nameInput.pattern);
  if (!namePattern.test(name)) {
    inputCheck("nameInput", insertedName, "contactErrorName", "inputContactErrorName", "editErrorName", "inputEditErrorName");
    return true;
  }
  if (insertedName == "nameInput") {
    inputClassListClear("contactErrorName", "inputContactErrorName");
  } else {
    inputClassListClear("editErrorName", "inputEditErrorName");
  }
}

/**
 * Checks the provided input and applies error styles accordingly.
 * @param {string} crossCheckId - The reference ID for checking input.
 * @param {string} insertedId - The ID of the actual input field.
 * @param {string} addP - The ID of the paragraph element for error display.
 * @param {string} addDiv - The ID of the div element for error display.
 * @param {string} editP - The ID of the paragraph element for editing error display.
 * @param {string} editDiv - The ID of the div element for editing error display.
 * @returns {boolean} - Always returns true indicating an error state.
 */
function inputCheck(crossCheckId, insertedId, addP, addDiv, editP, editDiv) {
  if (insertedId == crossCheckId) {
    inputClassListError(addP, addDiv);
    return true;
  } else {
    inputClassListError(editP, editDiv);
    return true;
  }
}

/**
 * Validates the provided email input against a predefined pattern.
 * @param {string} insertedEmail - The ID of the email input field.
 * @returns {boolean} - Returns true if the input is invalid.
 */
function checkEmail(insertedEmail) {
  let mailInput = document.getElementById(insertedEmail);
  let email = mailInput.value.trim();
  let standardPattern = document.getElementById("mailInput");
  let emailPattern = new RegExp(standardPattern.pattern);
  if (!emailPattern.test(email)) {
    inputCheck("mailInput", insertedEmail, "contactErrorEmail", "inputContactErrorEmail", "editErrorEmail", "inputEditErrorEmail");
    return true;
  }
  if (insertedEmail == "mailInput") {
    inputClassListClear("contactErrorEmail", "inputContactErrorEmail");
  } else {
    inputClassListClear("editErrorEmail", "inputEditErrorEmail");
  }
}

/**
 * Validates the provided phone input against a predefined pattern.
 * @param {string} insertedPhone - The ID of the phone input field.
 * @returns {boolean} - Returns true if the input is invalid.
 */
function checkPhone(insertedPhone) {
  let telInput = document.getElementById(insertedPhone);
  let phone = document.getElementById(insertedPhone).value.trim();
  let telPattern = new RegExp(telInput.pattern);
  if (!telPattern.test(phone)) {
    inputCheck("telInput", insertedPhone, "contactErrorTel", "inputContactErrorTel", "editErrorTel", "inputEditErrorTel");
    return true;
  }
  if (insertedPhone == "telInput") {
    inputClassListClear("contactErrorTel", "inputContactErrorTel");
  } else {
    inputClassListClear("editErrorTel", "inputEditErrorTel");
  }
}
/**
 * Deletes a contact and reloads the page.
 * @async
 * @param {string} path - The path of the contact to be deleted.
 */
async function deleteContact(path) {
  await delete_data(path);
  window.location.reload();
}

/**
 * Edits a user's contact information after validation.
 * @async
 * @param {string} name - The ID of the name input field.
 * @param {string} email - The ID of the email input field.
 * @param {string} tel - The ID of the phone input field.
 * @param {string} id - The ID of the user.
 * @param {number} indexContacts - The index of the contact in the contacts array.
 */
async function editUser(name, email, tel, id, indexContacts) {
  if (checkName("nameInputEdit")) {
    return;
  } else if (checkEmail("mailInputEdit")) {
    return;
  } else if (checkPhone("telInputEdit")) {
    return;
  } else {
    editUserSuccess(name, email, tel, id, indexContacts);
  }
}

/**
 * Handles a successful user edit operation.
 * @async
 * @param {string} name - The ID of the name input field.
 * @param {string} email - The ID of the email input field.
 * @param {string} tel - The ID of the phone input field.
 * @param {string} id - The ID of the user.
 * @param {number} indexContacts - The index of the contact in the contacts array.
 */
async function editUserSuccess(name, email, tel, id, indexContacts) {
  editedContact = [];
  let changeName = document.getElementById(name).value;
  let changeEmail = document.getElementById(email).value;
  let changeTel = document.getElementById(tel).value;
  await editUserSubmit(indexContacts, changeName, changeEmail, changeTel, id);
  editedContact = id;
  await loadDataContacts();
  findEditedContactIndex(editedContact);
  clearInput(name, email, tel);
  closeEditContactSave();
  d_none("overlayEdit");
}

/**
 * Submits the edited user data to the database.
 * @async
 * @param {number} indexContacts - The index of the contact in the contacts array.
 * @param {string} changeName - The new name value.
 * @param {string} changeEmail - The new email value.
 * @param {string} changeTel - The new phone number value.
 * @param {string} id - The ID of the user.
 */
async function editUserSubmit(indexContacts, changeName, changeEmail, changeTel, id) {
  await edit_data(`contacts/` + id, {
    name: changeName,
    email: changeEmail,
    phone: changeTel,
    colorId: contacts[indexContacts].colorId,
  });
}

/**
 * Clears input fields for name, email, and phone.
 * @param {string} name - The ID of the name input field.
 * @param {string} email - The ID of the email input field.
 * @param {string} tel - The ID of the phone input field.
 */
function clearInput(name, email, tel) {
  clearInputName(name);
  clearInputEmail(email);
  clearInputPhone(tel);
}

/**
 * Clears the name input field and removes error styling.
 * @param {string} name - The ID of the name input field.
 */
function clearInputName(name) {
  document.getElementById(name).value = "";
  inputClassListClear("contactErrorName", "inputContactErrorName");
}

/**
 * Clears the email input field and removes error styling.
 * @param {string} email - The ID of the email input field.
 */
function clearInputEmail(email) {
  document.getElementById(email).value = "";
  inputClassListClear("contactErrorEmail", "inputContactErrorEmail");
}

/**
 * Clears the phone input field and removes error styling.
 * @param {string} tel - The ID of the phone input field.
 */
function clearInputPhone(tel) {
  document.getElementById(tel).value = "";
  inputClassListClear("contactErrorTel", "inputContactErrorTel");
}

/**
 * Adds error styling to an input field.
 * @param {string} remove - The ID of the element to remove styling from.
 * @param {string} add - The ID of the element to add styling to.
 */
function inputClassListError(remove, add) {
  document.getElementById(remove).classList.remove("d_none");
  document.getElementById(add).classList.add("inputContactDisplay");
}

/**
 * Removes error styling from an input field.
 * @param {string} add - The ID of the element to add styling to.
 * @param {string} remove - The ID of the element to remove styling from.
 */
function inputClassListClear(add, remove) {
  document.getElementById(add).classList.add("d_none");
  document.getElementById(remove).classList.remove("inputContactDisplay");
}
/**
 * Opens the edit overlay and populates it with contact details.
 *
 * @param {number} indexContacts - The index of the contact in the contacts array.
 */
function openEditOverlay(indexContacts) {
  document.getElementById("editInitialsColor").innerHTML = "";
  document.getElementById("editForm").innerHTML = "";
  document.getElementById("editButtons").innerHTML = "";
  document.getElementById("editWindow").classList.remove("d_none");

  let contact = contacts[indexContacts];
  document.getElementById("editForm").innerHTML = editFormInsert(contact);
  document.getElementById("editInitialsColor").innerHTML = editInitialsInsert(contact);
  document.getElementById("editButtons").innerHTML = editButtonsInsert(contact, indexContacts);
}

/**
 * Toggles between two CSS classes on an element.
 *
 * @param {string} windowId - The ID of the element to toggle classes on.
 * @param {string} styleA - The first class to toggle.
 * @param {string} styleB - The second class to toggle.
 */
function toggleStyleChange(windowId, styleA, styleB) {
  document.getElementById(windowId).classList.toggle(styleA);
  document.getElementById(windowId).classList.toggle(styleB);
}

/**
 * Displays contact details window with a toggle animation.
 *
 * @param {string} windowId - The ID of the details window element.
 * @param {string} styleA - The first class to toggle.
 * @param {string} styleB - The second class to toggle.
 */
async function showContactDetails(windowId, styleA, styleB) {
  if (document.getElementById(windowId).classList.value == "contactsDisplay detailsWindow") {
    toggleStyleChange(windowId, styleA, styleB);
    await delay(0.1);
    toggleStyleChange(windowId, styleA, styleB);
  } else {
    toggleStyleChange(windowId, styleA, styleB);
  }
}

/**
 * Closes the details menu if the window width is less than or equal to 960 pixels
 * and the edit buttons are in the open position.
 *
 * @param {string} windowId - The ID of the details window element.
 * @param {string} styleA - The first class to toggle.
 * @param {string} styleB - The second class to toggle.
 */
function closeDetailsMenu(windowId, styleA, styleB) {
  if (window.innerWidth <= 960 && document.getElementById("editButtonsPosition").classList.contains("editButtonsPositionOpen")) {
    toggleStyleChange(windowId, styleA, styleB);
  }
}
