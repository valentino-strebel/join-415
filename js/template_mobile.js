/**
 * Generates the HTML for the mobile footer when the user is logged out.
 *
 * @returns {string} HTML string for the logged-out mobile footer.
 */
function mobileFooterLoggedOut() {
  return `
  <div class="navbar-wrapper-footer logIn" onclick='changeNavbarItems("login")'>
        <button class="navbar-menu-button navbar-footer-button">
          <img src="../assets/icons/nav_bar/log-in.svg" />
        </button>
        <span>Log In</span>
      </div>

      <div id="loggedOutLinks">
        <div class="navbar-wrapper-footer loggedOutButtons" 
         onclick='changeNavbarItems("privacy_policy")'>
          <button class="navbar-menu-button navbar-footer-button">
            <span>Privacy Policy </span>
          </button>
        </div>

        <div class="navbar-wrapper-footer loggedOutButtons" onclick='changeNavbarItems("legal_notice")'>
          <button class="navbar-menu-button navbar-footer-button">
            <span>Legal Notice </span>
          </button>
        </div>
      </div>
  `;
}

/**
 * Generates the HTML for the mobile footer when the user is logged in.
 *
 * @returns {string} HTML string for the logged-in mobile footer.
 */
function mobileFooterLoggedIn() {
  return `
<div class="navbar-wrapper-footer" onclick='changeNavbarItems("summary")'>
  <button class="navbar-menu-button navbar-footer-button">
    <img src="../assets/icons/nav_bar/summary-icon.svg" />
  </button>
  <span>Summary</span>
</div>
<div class="navbar-wrapper-footer" onclick='changeNavbarItems("board")'>
  <button class="navbar-menu-button navbar-footer-button">
    <img src="../assets/icons/nav_bar/board-icon.svg" />
  </button>
  <span>Board</span>
</div>
<div class="navbar-wrapper-footer" onclick='changeNavbarItems("addtask")'>
  <button class="navbar-menu-button navbar-footer-button">
    <img src="../assets/icons/nav_bar/addtask-icon.svg" />
  </button>
  <span>Add Task</span>
</div>
<div class="navbar-wrapper-footer" onclick='changeNavbarItems("contacts")'>
  <button class="navbar-menu-button navbar-footer-button">
    <img src="../assets/icons/nav_bar/contacts-icon.svg" />
  </button>
  <span>Contacts</span>
</div>
`;
}

/**
 * Generates the HTML for the desktop navbar when the user is logged in.
 *
 * @returns {string} HTML string for the logged-in desktop navbar.
 */
function desktopNavbarLoggedIn() {
  return `
    <div class="navbar-menu-button-wrapper" onclick='changeNavbarItems("summary")'>
      <button class="navbar-menu-button">
        <img src="../assets/icons/nav_bar/summary-icon.svg" />Summary
      </button>
    </div>
    <div class="navbar-menu-button-wrapper" onclick='changeNavbarItems("addtask")'>
      <button class="navbar-menu-button">
        <img src="../assets/icons/nav_bar/addtask-icon.svg" />Add Task
      </button>
    </div>
    <div class="navbar-menu-button-wrapper" onclick='changeNavbarItems("board")'>
      <button class="navbar-menu-button">
        <img src="../assets/icons/nav_bar/board-icon.svg" />Board
      </button>
    </div>
    <div class="navbar-menu-button-wrapper" onclick='changeNavbarItems("contacts")'>
      <button class="navbar-menu-button">
        <img src="../assets/icons/nav_bar/contacts-icon.svg" />Contacts
      </button>
    </div>
  `;
}

/**
 * Generates the HTML for the desktop navbar when the user is logged out.
 *
 * @returns {string} HTML string for the logged-out desktop navbar.
 */
function desktopNavbarLoggedOut() {
  return `
    <div class="navbar-menu-button-wrapper" onclick='changeNavbarItems("login")'>
      <button class="navbar-menu-button">
        <img src="../assets/icons/nav_bar/log-in.svg" />Log In
      </button>
    </div>
  `;
}
