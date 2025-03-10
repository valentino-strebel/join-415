/**
 * Validates all required input fields.
 * Adds event listeners to clear errors when input is provided.
 *
 * @returns {boolean} - Returns true if all required fields are filled, otherwise false.
 */
function validateRequiredFields() {
  let requiredFields = document.querySelectorAll("[required]");
  let isValid = true;
  requiredFields.forEach((field) => {
    field.addEventListener("input", () => showError(field, ""));

    if (!field.value.trim()) {
      if (isValid) {
        isValid = showError(field, "This field is required");
      }
    } else {
      showError(field, "");
    }
  });
  return isValid;
}

/**
 * Validates the contacts selection.
 * Ensures at least one contact is selected.
 *
 * @returns {boolean} - Returns false and shows error if no contact is selected, otherwise true.
 */
function validateContacts() {
  let contactSearch = document.getElementById("contacts-search");
  contactSearch.addEventListener("input", () => showError(contactSearch, ""));
  if (!selectedContactsIDs || !Array.isArray(selectedContactsIDs) || selectedContactsIDs.length === 0) {
    return showError(contactSearch, "Please select at least one contact");
  }
  return showError(contactSearch, "");
}

/**
 * Validates the category selection.
 * Ensures a category is selected.
 *
 * @returns {boolean} - Returns false and shows error if no category is selected, otherwise true.
 */
function validateCategory() {
  let category = document.getElementById("inputCategory");
  category.addEventListener("change", () => showError(category, ""));
  if (!category.value) {
    return showError(category, "Please select a category");
  }
  return showError(category, "");
}

/**
 * Validates the priority selection.
 * Ensures a priority button is selected.
 *
 * @returns {boolean} - Returns false and shows error if no priority is selected, otherwise true.
 */
function validatePriority() {
  let priorityButtons = document.querySelectorAll(".add-task-prio button");
  priorityButtons.forEach((button) => {
    button.addEventListener("click", () => showError(button, ""));
  });
  if (!selectedPrio) {
    let priorityContainer = document.querySelector(".add-task-prio");
    return showError(priorityContainer, "Please select a priority");
  }
  return true;
}

/**
 * Validates all form fields including required fields, contacts, category, and priority.
 *
 * @returns {boolean} - Returns true if all validations pass, otherwise false.
 */
function validateData() {
  return validateRequiredFields() && validateContacts() && validateCategory() && validatePriority();
}

/**
 * Opens the contacts list dropdown.
 *
 * @param {string} listId - The ID of the contacts list element.
 */
function openContactsList(listId) {
  document.getElementById(listId).style.display = "block";
}

/**
 * Closes the contacts list dropdown.
 *
 * @param {string} listId - The ID of the contacts list element.
 */
function closeContactsList(listId) {
  document.getElementById(listId).style.display = "none";
}

/**
 * Toggles the selection of a contact checkbox.
 *
 * @param {string} checkboxId - The ID of the checkbox element.
 * @param {string} contactId - The ID of the contact.
 * @param {string} selectId - The ID of the selection container.
 */
function selectCheckBox(checkboxId, contactId, selectId) {
  let checkStatus = document.getElementById(checkboxId);
  checkStatus.checked = !checkStatus.checked;
  focusDiv(selectId);
  toggleCheckbox(contactId);
}

/**
 * Sets the minimum selectable date for a date input field.
 *
 * @param {string} dateId - The ID of the date input field.
 */
function minDate(dateId) {
  let inputDate = document.getElementById(dateId);
  inputDate.min = todayDate;
}

/**
 * Toggles a focus effect on a specified element.
 *
 * @param {string} divId - The ID of the div element.
 */
function focusDiv(divId) {
  document.getElementById(divId).classList.toggle("divFocus");
}
