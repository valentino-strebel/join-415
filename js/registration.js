/**
 * @type {Object} Stores login data globally.
 */
let login;

/**
 * Fetches and verifies login data.
 * @async
 * @returns {Promise<void>}
 */
async function getLoggedIn(guest) {
  try {
    await getLoginData("/login-data");

    if (guest) {
      changeNavbarItems(
        window.innerWidth < 960 ? "mobile_greeting" : "summary"
      );
    } else {
      proofLoginData();
    }
  } catch (error) {
    console.error("Error fetching login data", error);
  }
}

/**
 * Fetches login data from the server.
 * @async
 * @param {string} [path=""] The endpoint path for login data.
 * @returns {Promise<void>}
 */
async function getLoginData(path = "") {
  let response = await fetch(BASE_URL + path + ".json");
  login = await response.json();
}

/**
 * Verifies user login credentials.
 * @async
 * @param {string} [userId] The user ID (to be updated after verification).
 * @param {Object} [findUser] The user object if authentication succeeds.
 * @returns {Promise<void>}
 */
async function proofLoginData(userId, findUser) {
  let emailLogin = document.getElementById("email-login");
  let passwordLogin = document.getElementById("password-login");
  let loginData = Object.values(login || {});
  try {
    await proofLoginTry(emailLogin, passwordLogin, loginData, userId, findUser);
  } catch (error) {
    console.error("Error fetching login data:", error);
  }
}

/**
 * Attempts to authenticate user login credentials.
 * @async
 * @param {HTMLInputElement} emailLogin Input field for email.
 * @param {HTMLInputElement} passwordLogin Input field for password.
 * @param {Array} loginData The list of stored login credentials.
 * @param {string} userId The authenticated user ID.
 * @param {Object} findUser The authenticated user object.
 * @returns {Promise<void>}
 */
async function proofLoginTry(
  emailLogin,
  passwordLogin,
  loginData,
  userId,
  findUser
) {
  let results = findMatchingLoginData(emailLogin, passwordLogin, loginData);
  if (results.success) {
    userId = results.userId;
    findUser = results.findUser;
    await edit_data("/current-user", findUser);
    await changeNavbarItems(
      window.innerWidth < 960 ? "mobile_greeting" : "summary"
    );
    regAlright("logErrorName", "logInpName");
    regAlright("logErrorPw", "logInpPw");
    return;
  } else {
    regError("logErrorName", "logInpName");
    regError("logErrorPw", "logInpPw");
  }
}

/**
 * Searches for a matching user in the login data based on email and password input.
 *
 * @param {HTMLInputElement} emailLogin - The input field containing the user's email.
 * @param {HTMLInputElement} passwordLogin - The input field containing the user's password.
 * @param {Array<Object>} loginData - An array of user objects containing email and password information.
 * @returns {{ userId: string|null, findUser: Object|null, success: boolean }}
 *          Returns an object with the userId, findUser object, and a success boolean.
 */
function findMatchingLoginData(emailLogin, passwordLogin, loginData) {
  for (let id in loginData) {
    if (
      loginData[id].email === emailLogin.value.trim() &&
      loginData[id].password === passwordLogin.value.trim()
    ) {
      return {
        userId: Object.keys(login)[id],
        findUser: loginData[id],
        success: true,
      };
    }
  }
  return { userId: null, findUser: null, success: false };
}

/**
 * Handles user registration input validation.
 * @async
 * @returns {Promise<void>}
 */
async function registrationData() {
  let email = document.getElementById("email-input");
  let password = document.getElementById("password-input");
  let name = document.getElementById("name-input");
  let checkBox = document.getElementById("privacyPolicy");
  let nameValid = checkRegistrationData(name, "regErrorName", "regInpName");
  let emailValid = checkRegistrationData(email, "regErrorEmail", "regInpEmail");
  let passValid = checkRegistrationData(password, "regErrorPw", "regInpPw");
  let checkBoxValid = checkBoxValidity(checkBox, "regErrorCheckBox");
  registrationValidation(
    nameValid,
    emailValid,
    passValid,
    checkBoxValid,
    email,
    password,
    name
  );
}

/**
 * Validates registration form and processes registration if valid.
 * @async
 * @param {boolean} nameValid Whether the name field is valid.
 * @param {boolean} emailValid Whether the email field is valid.
 * @param {boolean} passValid Whether the password field is valid.
 * @param {boolean} checkBoxValid Whether the privacy policy checkbox is checked.
 * @param {HTMLInputElement} email Email input field.
 * @param {HTMLInputElement} password Password input field.
 * @param {HTMLInputElement} name Name input field.
 * @returns {Promise<void>}
 */
async function registrationValidation(
  nameValid,
  emailValid,
  passValid,
  checkBoxValid,
  email,
  password,
  name
) {
  if (
    confirmPassword() &&
    emailValid &&
    passValid &&
    nameValid &&
    checkBoxValid
  ) {
    successNotice();
    await update_data("/login-data", {
      email: email.value.trim(),
      password: password.value.trim(),
      name: name.value.trim(),
    });
    await wait(2000);
    changeNavbarItems("login");
  }
}

/**
 * Checks if the password and confirm password fields match.
 * @returns {boolean} True if passwords match, false otherwise.
 */
function confirmPassword() {
  let passwordInput = document.getElementById("password-input");
  let confPasswordInput = document.getElementById("confirm-password-input");
  if (
    passwordInput.value.trim() === confPasswordInput.value.trim() &&
    passwordInput.value.trim() !== ""
  ) {
    regAlright("regErrorPwCheck", "regInpPwCheck");
    return true;
  } else {
    regError("regErrorPwCheck", "regInpPwCheck");
    return false;
  }
}

/**
 * Validates the input field against the provided pattern.
 * @param {HTMLInputElement} insertedData - The input field element.
 * @param {string} remove - The ID of the element to remove the error class from.
 * @param {string} add - The ID of the element to add the success class to.
 * @returns {boolean} - Returns true if input is valid, otherwise false.
 */
function checkRegistrationData(insertedData, remove, add) {
  let insertedDataValue = insertedData.value.trim();
  let insertedDataPattern = new RegExp(insertedData.pattern);
  if (!insertedDataPattern.test(insertedDataValue)) {
    regError(remove, add);
    return false;
  } else {
    regAlright(remove, add);
    return true;
  }
}

/**
 * Checks if a checkbox is checked and toggles error visibility accordingly.
 * @param {HTMLInputElement} checkBox - The checkbox input element.
 * @param {string} remove - The ID of the element to remove the error class from if checked.
 * @returns {boolean} - Returns true if checkbox is checked, otherwise false.
 */
function checkBoxValidity(checkBox, remove) {
  if (checkBox.checked == true) {
    document.getElementById(remove).classList.add("d_none");
    return true;
  } else {
    document.getElementById(remove).classList.remove("d_none");
    return false;
  }
}

/**
 * Displays an error by toggling the relevant CSS classes.
 * @param {string} remove - The ID of the element to remove the error class from.
 * @param {string} add - The ID of the element to add the error class to.
 */
function regError(remove, add) {
  document.getElementById(remove).classList.remove("d_none");
  document.getElementById(add).classList.add("regDisplay");
}

/**
 * Hides an error by toggling the relevant CSS classes.
 * @param {string} remove - The ID of the element to add the error class to.
 * @param {string} add - The ID of the element to remove the error class from.
 */
function regAlright(remove, add) {
  document.getElementById(remove).classList.add("d_none");
  document.getElementById(add).classList.remove("regDisplay");
}

/**
 * Changes the background image of the password input field.
 */
function changePWImage() {
  let pwInput = document.getElementById("password-input");
  pwInput.style.backgroundImage =
    "url(../assets/icons/login_signup/visibility_off.svg)";
}

/**
 * Changes the background image of the confirm password input field.
 */
function changeConfPWImage() {
  let confPWInput = document.getElementById("confirm-password-input");
  confPWInput.style.backgroundImage =
    "url(../assets/icons/login_signup/visibility_off.svg)";
}

/**
 * Changes the background image of the login password input field.
 */
function changeImageLogin() {
  let pwLogin = document.getElementById("password-login");
  pwLogin.style.backgroundImage =
    "url(../assets/icons/login_signup/visibility_off.svg)";
}

/**
 * Animates the logo change and redirects to the login page after a delay.
 */
function changeLogoSize() {
  let joinHome = document.getElementById("join-home");
  joinHome.classList.remove("join-home");
  joinHome.classList.add("logo-animation");
  setTimeout(() => {
    openLoginHTML();
  }, 1200);
}

/**
 * Logs in a guest user by setting default credentials,
 * updating user data, and changing the navigation bar accordingly.
 *
 * @async
 * @function openGuestLogin
 * @returns {Promise<void>} A promise that resolves after user data is updated.
 */
async function openGuestLogin() {
  let guest = {
    name: "Guest",
    password: 12345678,
  };
  await edit_data("/current-user", guest);
  getLoggedIn(guest);
  changeNavbarItems(window.innerWidth < 960 ? "mobile_greeting" : "summary");
}

/**
 * Toggles the visibility of the password field between text and password types.
 *
 * @function togglePasswordVisibility
 * @returns {void}
 */
function togglePasswordVisibility() {
  let { passwordField, eyeIcon } = getContent();

  if (passwordField.type === "password") {
    setPasswordVisible(passwordField, eyeIcon);
  } else {
    setPasswordHidden(passwordField, eyeIcon);
  }
}

/**
 * Sets the password field to visible mode.
 *
 * @function setPasswordVisible
 * @param {HTMLInputElement} passwordField - The password input field.
 * @param {HTMLImageElement} eyeIcon - The eye icon used to toggle visibility.
 * @returns {void}
 */
function setPasswordVisible(passwordField, eyeIcon) {
  passwordField.type = "text";
  eyeIcon.src = "../assets/icons/login_signup/visibility.svg";
}

/**
 * Sets the password field to hidden mode.
 *
 * @function setPasswordHidden
 * @param {HTMLInputElement} passwordField - The password input field.
 * @param {HTMLImageElement} eyeIcon - The eye icon used to toggle visibility.
 * @returns {void}
 */
function setPasswordHidden(passwordField, eyeIcon) {
  passwordField.type = "password";
  eyeIcon.src = "../assets/icons/login_signup/visibility_off.svg";
}

/**
 * Handles focus event on the password field.
 * If the field is empty, sets the eye icon to indicate hidden password mode.
 *
 * @function handleFocus
 * @returns {void}
 */
function handleFocus() {
  let { passwordField, eyeIcon } = getContent();

  if (passwordField.value === "") {
    eyeIcon.src = "../assets/icons/login_signup/visibility_off.svg";
  }
}

/**
 * Handles blur event on the password field.
 * If the field is empty, sets the eye icon to indicate a locked state.
 *
 * @function handleBlur
 * @returns {void}
 */
function handleBlur() {
  let { passwordField, eyeIcon } = getContent();

  if (passwordField.value === "") {
    eyeIcon.src = "../assets/icons/login_signup/lock.svg";
  }
}

/**
 * Retrieves elements related to password visibility.
 *
 * @function getContent
 * @returns {{ eyeIcon: HTMLElement, passwordField: HTMLInputElement }}
 *          An object containing the eye icon and password input field.
 */
function getContent() {
  return {
    eyeIcon: document.getElementById("eye-icon"),
    passwordField: document.getElementById("password-login"),
  };
}

/**
 * Toggles the visibility of the registration success notification.
 *
 * @function successNotice
 * @returns {void}
 */
function successNotice() {
  document.getElementById("registrationOverlay").classList.toggle("d_none");
  let successContainer = document.getElementById("creationSuccessContainer");
  successContainer.classList.toggle("creationSuccessContainerClosed");
  successContainer.classList.toggle("creationSuccessContainer");
}

/**
 * Creates a delay for a specified duration.
 *
 * @async
 * @function wait
 * @param {number} ms - The duration to wait in milliseconds.
 * @returns {Promise<void>} A promise that resolves after the specified time.
 */
async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
