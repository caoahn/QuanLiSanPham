// CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat .inner-form");
if (formSendData) {
  formSendData.addEventListener("submit", async function (e) {
    e.preventDefault();
    const content = e.target.elements.content.value;

    if (content) {
      socket.emit("CLIENT_SEND_MESSAGE", content);
      e.target.elements.content.value = "";
    }
  });
}

// END CLIENT_SEND_MESSAGE
// SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
  const myId = document.querySelector("[my-id]").getAttribute("my-id");
  const body = document.querySelector(".chat .inner-body");

  const div = document.createElement("div");

  let htmlFullName = "";
  if (myId === data.userId) {
    div.classList.add("inner-outgoing");
  } else {
    div.classList.add("inner-incoming");
    htmlFullName = <div class="inner-name">${data.fullName}</div>;
  }

  div.innerHTML = <div class="inner-name">${data.fullName}</div>;
  <div class="inner-content">${data.content}</div>;

  body.appendChild(div);
});

//END SERVER_RETURN_MESSAGE
