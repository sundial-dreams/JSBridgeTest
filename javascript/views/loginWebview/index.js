!function (window, document) {
  const accountInput = document.querySelector(".login-wrapper .input-wrapper input[type=text]");
  const passwordInput = document.querySelector(".login-wrapper .input-wrapper input[type=password]");
  const loginButton = document.querySelector(".button.login");
  const quitButton = document.querySelector(".button.quit");
  // window.NativeBridge

  window.NativeBridge = window.NativeBridge || {};

  loginButton.addEventListener("click", function (e) {
    window.NativeBridge.openNewPage(accountInput.value + passwordInput.value);
  }, false);

  quitButton.addEventListener("click", function (e) {
    window.NativeBridge.quit();
  }, false);

}(window, document);
