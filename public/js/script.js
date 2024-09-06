//Show Thong bao
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
  const time = parseInt(showAlert.getAttribute("data-time"));

  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time);

  const closeAlert = showAlert.querySelector("[close-alert]");
  closeAlert.addEventListener("click", () => {
    showAlert.classList.add("alert-hidden");
  });
}
// End show thong bao
// button go back
const buttonsGoBack = document.querySelectorAll("[button-go-back]");
if (buttonsGoBack.length > 0) {
  buttonsGoBack.forEach((button) => {
    button.addEventListener("click", () => {
      history.back();
    });
  });
}
// end button go back
