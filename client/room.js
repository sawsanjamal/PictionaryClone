import { io } from "socket.io-client";
import DrawableCanvas from "./DrawableCanvas";
const production = process.env.NODE_ENV === "production";
const serverURL = production ? "realsite.com" : "http://localhost:3000";

const urlParams = new URLSearchParams(window.location.search);
const name = urlParams.get("name");
const roomId = urlParams.get("room-id");

if (!name || !roomId) window.location = "/index.html";

const socket = io(serverURL);
const guessForm = document.querySelector("[data-guess-form]");
const guessInput = document.querySelector("[data-guess-input]");
const wordElement = document.querySelector("[data-word]");
const messagesElement = document.querySelector("[data-messages]");
const readyButton = document.querySelector("[data-ready-button]");
const canvas = document.querySelector("[data-canvas]");
const drawableCanvas = new DrawableCanvas(canvas, socket);
const guessTemplate = document.querySelector("[data-guess-template]");

socket.emit("join-room", { name: name, roomId: roomId });
socket.on("start-drawer", startRoundDrawer);
socket.on("start-guesser", startRoundGuesser);
socket.on("guess", displayGuess);
endRound();
resizeCanvas();
setupHTMLEvents();

function setupHTMLEvents() {
  readyButton.addEventListener("click", () => {
    hide(readyButton);
    socket.emit("ready");
  });
  guessForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (guessInput.value === " ") return;

    socket.emit("make-guess", { guess: guessInput.value });
    displayGuess(name, guessInput.value);

    guessInput.value = " ";
  });

  window.addEventListener("resize", resizeCanvas);
}
function displayGuess(guesserName, guess) {
  const guessElement = guessTemplate.content.cloneNode(true);
  const messageElement = guessElement.querySelector("[data-text]");
  const nameElement = guessElement.querySelector("[data-name]");
  nameElement.innerText = guesserName;
  messageElement.innerText = guess;
  messagesElement.append(guessElement);
}
function startRoundDrawer(word) {
  drawableCanvas.canDraw = true;
  wordElement.innerText = word;
}

function startRoundGuesser() {
  show(guessForm);
}

function resizeCanvas() {
  canvas.height = null;
  canvas.width = null;
  const clientDimensions = canvas.getBoundingClientRect();
  canvas.width = clientDimensions.width;
  canvas.height = clientDimensions.height;
}

function endRound() {
  drawableCanvas.canDraw = false;
  hide(guessForm);
}

function hide(element) {
  element.classList.add("hide");
}

function show(element) {
  element.classList.remove("hide");
}
