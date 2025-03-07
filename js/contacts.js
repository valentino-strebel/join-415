let lastContact = [];

let editedContact = [];

function orderContactsBoard() {
  lastContact = [];
  lastContact = contacts[contacts.length - 1];
  groupContacts();
}

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

function openContactDetails(indexContacts) {
  document.getElementById("detailsProfile").innerHTML = "";
  document.getElementById("detailsContact").innerHTML = "";
  let detailsMobile = document.getElementById("contactsDetailsMobile");
  let contact = contacts[indexContacts];
  detailsMobile.classList.remove("d_none");
  document.getElementById("detailsProfile").innerHTML = detailsProfileInsert(contact, indexContacts);
  document.getElementById("detailsContact").innerHTML = detailsContactInsert(contact);
}

async function getContactData(inputName, inputEmail, inputPhone, overId) {
  if ([inputName, inputEmail, inputPhone].some((input, i) => [checkName, checkEmail, checkPhone][i](input))) {
    return;
  }
  await userCreateSuccess(inputName, inputEmail, inputPhone);
  await loadDataContacts();
  cleanWindow(inputName, inputEmail, inputPhone, overId);
  closeAddContactSuccess();
}

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

function getRandomNumber() {
  return Math.floor(Math.random() * 10);
}

function cleanWindow(inputName, inputEmail, inputPhone, overId) {
  clearInput(inputName, inputEmail, inputPhone);
  d_none(overId);
  showCreationHint("createdInfo", "createdContactInfo", "createdContactInfoOut");
  toggleStyleChange("contactWindow", "addContactWindowClosed", "addContactWindow");
  showContactDetails("contactsDisplay", "detailsWindowClosed", "detailsWindow");
  findLastContactIndex();
}

function findLastContactIndex() {
  let lastId = lastContact.id;
  let myId = (item) => item.id == lastId;
  let foundId = contacts.findIndex(myId);
  openContactDetails(foundId);
}

function findEditedContactIndex(editedContact) {
  let editedId = editedContact;
  let myId = (item) => item.id == editedId;
  let foundId = contacts.findIndex(myId);
  openContactDetails(foundId);
}

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

function inputCheck(crossCheckId, insertedId, addP, addDiv, editP, editDiv) {
  if (insertedId == crossCheckId) {
    inputClassListError(addP, addDiv);
    return true;
  } else {
    inputClassListError(editP, editDiv);
    return true;
  }
}

function checkEmail(insertedEmail) {
  let mailInput = document.getElementById(insertedEmail);
  let email = mailInput.value.trim();
  let emailPattern = new RegExp(mailInput.pattern);
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

async function deleteContact(path) {
  await delete_data(path);
  window.location.reload();
}

async function editUser(name, email, tel, id, indexContacts) {
  if (checkName("nameInputEdit") === true) {
    return;
  } else if (checkEmail("mailInputEdit") === true) {
    return;
  } else if (checkPhone("telInputEdit") === true) {
    return;
  } else {
    editUserSuccess(name, email, tel, id, indexContacts);
  }
}

async function editUserSuccess(name, email, tel, id, indexContacts) {
  editedContact = [];
  let changeName = document.getElementById(name).value;
  let changeEmail = document.getElementById(email).value;
  let changeTel = document.getElementById(tel).value;
  await edit_data(
    (path = `contacts/` + id),
    (data = {
      name: changeName,
      email: changeEmail,
      phone: changeTel,
      colorId: contacts[indexContacts].colorId,
    }),
  );
  editedContact = id;
  await loadDataContacts();
  findEditedContactIndex(editedContact);
  clearInput(name, email, tel);
  closeEditContactSave();
}

function clearInput(name, email, tel) {
  clearInputName(name);
  clearInputEmail(email);
  clearInputPhone(tel);
}

function clearInputName(name) {
  document.getElementById(name).value = "";
  inputClassListClear("contactErrorName", "inputContactErrorName");
}
function clearInputEmail(email) {
  document.getElementById(email).value = "";
  inputClassListClear("contactErrorEmail", "inputContactErrorEmail");
}

function clearInputPhone(tel) {
  document.getElementById(tel).value = "";
  inputClassListClear("contactErrorTel", "inputContactErrorTel");
}

function inputClassListError(remove, add) {
  document.getElementById(remove).classList.remove("d_none");
  document.getElementById(add).classList.add("inputContactDisplay");
}

function inputClassListClear(add, remove) {
  document.getElementById(add).classList.add("d_none");
  document.getElementById(remove).classList.remove("inputContactDisplay");
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

function toggleStyleChange(windowId, styleA, styleB) {
  document.getElementById(windowId).classList.toggle(styleA);
  document.getElementById(windowId).classList.toggle(styleB);
}

async function showContactDetails(windowId, styleA, styleB) {
  if (document.getElementById(windowId).classList == "contactsDisplay detailsWindow") {
    toggleStyleChange(windowId, styleA, styleB);
    await delay(0.1);
    toggleStyleChange(windowId, styleA, styleB);
  } else {
    toggleStyleChange(windowId, styleA, styleB);
  }
}

function closeDetailsMenu(windowId, styleA, styleB) {
  if (window.innerWidth <= 960 && document.getElementById("editButtonsPosition").classList == "editButtonsPositionOpen") {
    toggleStyleChange(windowId, styleA, styleB);
  }
}
