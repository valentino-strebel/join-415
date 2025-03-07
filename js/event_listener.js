let subtaskRef = document.getElementById("subtaskInput");

let contactsInputRef = document.getElementById("contact-search");

let contactsCheckRef = document.getElementById("contacts-checkbox");

let passwordField = document.getElementById("password-login");

let toggleButton = document.getElementById("toggle-password");

let list = document.getElementById("contacts-checkbox");

let searchBox = document.getElementById("contact-search");

if (window.location.pathname.includes("board.html")) {
  window.addEventListener("resize", adjustSearchContainerPosition);
  window.addEventListener("load", adjustSearchContainerPosition);
  document.addEventListener("click", function (event) {
    if (!list.contains(event.target) && event.target !== searchBox) {
      list.style.display = "none";
    }
  });
}

if (subtaskRef) {
  subtaskRef.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      confirmInput();
    }
  });
}

if (window.location.pathname.includes("login.html")) {
  document.addEventListener("DOMContentLoaded", function () {
    toggleButton.addEventListener("click", togglePasswordVisibility);
    passwordField.addEventListener("focus", handleFocus);
    passwordField.addEventListener("blur", handleBlur);
  });
}
