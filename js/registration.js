let login;

async function getLoggedIn() {
  try {
    await getLoginData((path = "/login-data"));
    proofLoginData(login);
  } catch (error) {
    console.log("Error fetching login data", error);
  }
}

async function getLoginData(path = "") {
  let response = await fetch(BASE_URL + path + ".json");
  login = await response.json();
}

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

async function proofLoginTry(emailLogin, passwordLogin, loginData, userId, findUser) {
  for (let id in loginData) {
    if (loginData[id].email === emailLogin.value.trim() && loginData[id].password === passwordLogin.value.trim()) {
      findUser = loginData[id];
      userId = Object.keys(login)[id];
      await edit_data("/current-user", findUser);
      changeNavbarItems(window.innerWidth < 960 ? "mobile_greeting" : "summary");
      regAlright("logErrorName", "logInpName");
      regAlright("logErrorPw", "logInpPw");

      return;
    } else {
      regError("logErrorName", "logInpName");
      regError("logErrorPw", "logInpPw");
    }
  }
}

async function registrationData() {
  let email = document.getElementById("email-input");
  let password = document.getElementById("password-input");
  let name = document.getElementById("name-input");
  let checkBox = document.getElementById("privacyPolicy");
  let nameValid = checkRegistrationData(name, "regErrorName", "regInpName");
  let emailValid = checkRegistrationData(email, "regErrorEmail", "regInpEmail");
  let passValid = checkRegistrationData(password, "regErrorPw", "regInpPw");
  let checkBoxValid = checkBoxValidity(checkBox, "regErrorCheckBox");
  registrationValidation(nameValid, emailValid, passValid, checkBoxValid, email, password, name);
}

async function registrationValidation(nameValid, emailValid, passValid, checkBoxValid, email, password, name) {
  if (confirmPassword() == true && emailValid == true && passValid == true && nameValid == true && checkBoxValid == true) {
    successNotice();
    await update_data("/login-data", {
      email: `${email.value.trim()}`,
      password: `${password.value.trim()}`,
      name: `${name.value.trim()}`,
    });
    await wait(2000);
    changeNavbarItems("login");
  } else {
    return;
  }
}

function confirmPassword() {
  let passwordInput = document.getElementById("password-input");
  let confPasswordInput = document.getElementById("confirm-password-input");
  if (passwordInput.value.trim() === confPasswordInput.value.trim() && (passwordInput.value.trim() && confPasswordInput.value.trim()) != "") {
    regAlright("regErrorPwCheck", "regInpPwCheck");
    return true;
  } else {
    regError("regErrorPwCheck", "regInpPwCheck");
    return false;
  }
}

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

function checkBoxValidity(checkBox, remove) {
  if (checkBox.checked == true) {
    document.getElementById(remove).classList.add("d_none");

    return true;
  } else {
    document.getElementById(remove).classList.remove("d_none");
  }
}

function regError(remove, add) {
  document.getElementById(remove).classList.remove("d_none");
  document.getElementById(add).classList.add("regDisplay");
}

function regAlright(remove, add) {
  document.getElementById(remove).classList.add("d_none");
  document.getElementById(add).classList.remove("regDisplay");
}

function changePWImage() {
  let pwInput = document.getElementById("password-input");

  pwInput.style.backgroundImage = "url(../assets/icons/login_signup/visibility_off.svg)";
}

function changeConfPWImage() {
  let confPWInput = document.getElementById("confirm-password-input");
  confPWInput.style.backgroundImage = "url(../assets/icons/login_signup/visibility_off.svg)";
}

function changeImageLogin() {
  let pwLogin = document.getElementById("password-login");
  pwLogin.style.backgroundImage = "url(../assets/icons/login_signup/visibility_off.svg)";
}

function changeLogoSize() {
  let joinHome = document.getElementById("join-home");

  joinHome.classList.remove("join-home");
  joinHome.classList.add("logo-animation");
  setTimeout(() => {
    openLoginHTML();
  }, 1200);
}

async function openGuestLogin() {
  let guest = {
    name: "Guest",
    password: 12345678,
  };
  await edit_data("/current-user", guest);
  getLoggedIn();
  changeNavbarItems(window.innerWidth < 960 ? "mobile_greeting" : "summary");
}

function togglePasswordVisibility() {
  let { passwordField, eyeIcon } = getContent();

  if (passwordField.type === "password") {
    setPasswordVisible(passwordField, eyeIcon);
  } else {
    setPasswordHidden(passwordField, eyeIcon);
  }
}

function setPasswordVisible(passwordField, eyeIcon) {
  passwordField.type = "text";
  eyeIcon.src = "../assets/icons/login_signup/visibility.svg";
}

function setPasswordHidden(passwordField, eyeIcon) {
  passwordField.type = "password";
  eyeIcon.src = "../assets/icons/login_signup/visibility_off.svg";
}

function handleFocus() {
  let { passwordField, eyeIcon } = getContent();

  if (passwordField.value === "") {
    eyeIcon.src = "../assets/icons/login_signup/visibility_off.svg";
  }
}

function handleBlur() {
  let { passwordField, eyeIcon } = getContent();

  if (passwordField.value === "") {
    eyeIcon.src = "../assets/icons/login_signup/lock.svg";
  }
}

function getContent() {
  return {
    eyeIcon: document.getElementById("eye-icon"),
    passwordField: document.getElementById("password-login"),
  };
}

function successNotice() {
  document.getElementById("registrationOverlay").classList.toggle("d_none");
  let successContainer = document.getElementById("creationSuccessContainer");
  successContainer.classList.toggle("creationSuccessContainerClosed");
  successContainer.classList.toggle("creationSuccessContainer");
}

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
