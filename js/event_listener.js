/**
 * Reference to the subtask input field.
 * @type {HTMLInputElement | null}
 */
let subtaskRef = document.getElementById("subtaskInput");

/**
 * Reference to the contacts search input field.
 * @type {HTMLInputElement | null}
 */
let contactsInputRef = document.getElementById("contact-search");

/**
 * Reference to the contacts checkbox container.
 * @type {HTMLElement | null}
 */
let contactsCheckRef = document.getElementById("contacts-checkbox");

/**
 * Reference to the password input field on the login page.
 * @type {HTMLInputElement | null}
 */
let passwordField = document.getElementById("password-login");

/**
 * Reference to the toggle password visibility button.
 * @type {HTMLButtonElement | null}
 */
let toggleButton = document.getElementById("toggle-password");

/**
 * Reference to the contacts checkbox container (duplicate reference).
 * @type {HTMLElement | null}
 */
let list = document.getElementById("contacts-checkbox");

/**
 * Reference to the contacts search input field (duplicate reference).
 * @type {HTMLInputElement | null}
 */
let searchBox = document.getElementById("contact-search");

/**
 * Adjusts the position of the search container on window resize or load.
 * Only runs if the current page is 'board.html'.
 */
if (window.location.pathname.includes("board.html")) {
  window.addEventListener("resize", adjustSearchContainerPosition);
  window.addEventListener("load", adjustSearchContainerPosition);

  /**
   * Hides the contact list if clicked outside of the list or the search box.
   * @param {MouseEvent} event - The click event.
   */
  document.addEventListener("click", function (event) {
    if (!list.contains(event.target) && event.target !== searchBox) {
      list.style.display = "none";
    }
  });
}

/**
 * Adds an event listener to the subtask input field when clicking "Enter".
 * Prevents default behavior and calls `confirmInput()`.
 */
if (subtaskRef) {
  subtaskRef.addEventListener("keydown", function (event) {
    /**
     * @param {KeyboardEvent} event - The keyboard event.
     */
    if (event.key === "Enter") {
      event.preventDefault();
      confirmInput();
    }
  });
}

/**
 * Adds event listeners when password is set. Only if the current page is 'login.html'.
 */
if (window.location.pathname.includes("login.html")) {
  document.addEventListener("DOMContentLoaded", function () {
    /**
     * Toggles the password visibility when the toggle button is clicked.
     */
    toggleButton.addEventListener("click", togglePasswordVisibility);

    /**
     * Handles password input focus event.
     */
    passwordField.addEventListener("focus", handleFocus);

    /**
     * Handles password input blur event.
     */
    passwordField.addEventListener("blur", handleBlur);
  });
}
