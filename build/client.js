let name = prompt("Enter your name to continue");
const audioBtn = document.getElementById("disableAudio");
const messageInput = document.getElementById("messageInput");
const form = document.getElementById("messageForm");
const chatBox = document.getElementById("chatBox");
var audio = new Audio("ting.mp3");
var sent = new Audio("sent.mp3");
const Socket = io("http://localhost:5000");

audioBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (audio.volume > 0 && sent.volume > 0) {
    audio.volume = 0;
    sent.volume = 0;
    audioBtn.innerHTML = '<i class="fa fa-volume-off"></i>';
  } else {
    audio.volume = 1;
    sent.volume = 1;
    audioBtn.innerHTML = '<i class="fa fa-volume-up"></i>';
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  append(`You: ${message}`, "right");
  Socket.emit("send", message);
  messageInput.value = "";
});

const append = (message, position) => {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageElement.classList.add("message");
  messageElement.classList.add(position);
  chatBox.append(messageElement);
  if (position === "left") audio.play();
  if (position === "right") sent.play();
};

Socket.emit("new-user-joined", name);

Socket.on("user-joined", (name) => {
  append(`${name} joined the chat.`, "left");
});

Socket.on("recieve", (data) => {
  append(`${data.name}: ${data.message}`, "left");
});

Socket.on("left", (name) => {
  append(`${name} left the chat.`, "left");
});
