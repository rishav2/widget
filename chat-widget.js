const linkElement = document.createElement("link");
linkElement.rel = "stylesheet";
linkElement.href =
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css";
linkElement.type = "text/css";

document.head.appendChild(linkElement);

//Here will go all html
document.body.innerHTML += `<div class="chat-widget-container">
    <div id="chat-widget" style="display: none;">
      <div id="chat-header">
        <span class="chat-title">Chat</span>
        <button class="close-chat"><i class="fas fa-times"></i></button>
      </div>
      <div id="chat-messages"></div>
      <div id="chat-input">
        <input type="text" id="message-input" placeholder="Type your message..." />
        <button id="send-button"><i class="fas fa-paper-plane"></i></button>
      </div>
    </div>

    <button class="open-chat"><i class="fas fa-comment"></i></button>
  </div>`;
// Create a new style element
const styleElement = document.createElement("style");
document.head.appendChild(styleElement);

// Here will go all css
const css = `
   body {
      --main-color: #5C37A9;
      --second-color: #E5E5E5;
      --third-color: #FF9A00;
      --fourth-color: #4a3181;
    }

    .chat-widget-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 999;
    }

    #chat-widget {
      width: 400px;
      height: 500px;
      background-color: #f1f1f1;
      border: 1px solid #ccc;
      border-radius: 4px;
      overflow: hidden;

      position: relative;
    }

    #chat-header {
      padding: 10px;
      background-color: var(--main-color);
      color: #fff;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    #chat-header .chat-title {
      margin-right: 10px;
    }

    #chat-messages {
      padding: 10px;
      height: 300px;
      overflow-y: auto;
    }

    #chat-input {
      padding: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      position: absolute;
      bottom: 0;
      width: 96%;
    }


    #message-input {
      flex-grow: 1;
      padding: 10px;
      border: 1px solid var(--main-color);
      border-radius: 4px;
      outline-color: var(--main-color);

      font-size: large;
    }

    #send-button {
      padding: 5px 10px;
      margin-left: 10px;
      background-color: var(--main-color);
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: large;
    }

    .open-chat {
      position: absolute;
      bottom: 0;
      right: 0;
      padding: 5px;
      background-color: var(--main-color);
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;

      font-size: larger;
    }

    .close-chat {
      background-color: transparent;
      color: #fff;
      border: none;
      cursor: pointer;
    }

    #admin-typing {
      padding: 5px;
      background-color: black;
      text-align: center;
      font-style: italic;
    }

    .message {
      margin-bottom: 10px;
      padding: 10px;
      border-radius: 10px;

      overflow-wrap: break-word;
      /* Allow the text to wrap to the next line */
      word-wrap: break-word;
      /* Additional property for older browsers */
      word-break: break-word;
      /* Break words if necessary */
    }

    .user {
      text-align: right;
      background-color: var(--fourth-color);
      color: #fff;
    }

    .admin {
      text-align: left;
      background-color: var(--second-color);
      color: var(--main-color);
      font-weight: bold;
    }

    .processing-icon {
      margin-right: 5px;
    }
`;

let messages = [];
let isLoggedIn = false; // Variable to track user login status

// Get DOM elements
const chatWidgetContainer = document.querySelector(".chat-widget-container");
const chatWidget = document.getElementById("chat-widget");
const openChatButton = document.querySelector(".open-chat");
const closeChatButton = document.querySelector(".close-chat");
const chatMessages = document.getElementById("chat-messages");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");

// Event listeners
openChatButton.addEventListener("click", openChat);
closeChatButton.addEventListener("click", closeChat);
sendButton.addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", handleTyping);

// Function to open the chat
function openChat() {
  chatWidget.style.display = "block";
  openChatButton.style.display = "none";
}

// Function to close the chat
function closeChat() {
  chatWidget.style.display = "none";
  openChatButton.style.display = "block";
}

// Function to send a message
function sendMessage() {
  const message = messageInput.value;

  // Append the message to the chat messages with user's alignment
  appendMessage(message, "user");

  // Clear the input field
  messageInput.value = "";
}

// Function to handle typing event
function handleTyping(event) {
  if (event.key === "Enter") {
    sendMessage();
  }
}

//function to append AI's response
function appendAiResponse(message) {}

// Function to append a message to the chat messages
// Update the appendMessage function as follows:
async function appendMessage(message, sender) {
  messages.push({ sender, message });
  localStorage.setItem("messages", JSON.stringify(messages));
  const messageElement = document.createElement("div");

  // Add the processing icon for admin messages
  if (sender === "admin") {
    const processingIcon = document.createElement("span");
    processingIcon.classList.add("processing-icon");
    processingIcon.innerHTML = '<i class="fas fa-spinner fa-pulse"></i>';
    messageElement.insertBefore(processingIcon, messageElement.firstChild);
    messageElement.classList.add("message", sender);
    chatMessages.appendChild(messageElement);
    const response = await fetch("https://api.beesers.com/chat/ask", {
      method: "POST",
      headers: {
        authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAYWRtaW4uY29tIiwiaWF0IjoxNjg4NDgwNTE2fQ.G_-oxFG7dZHhI9cwvJeEKJsaiqgJYxSOwoOkhOyybE8",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: message }),
    });
    const result = await response.json();
    messageElement.innerHTML = "";
    messageElement.textContent = result.answer.text;
  }

  if (sender === "user") {
    messageElement.textContent = message;
    messageElement.classList.add("message", sender);
    chatMessages.appendChild(messageElement);
    appendMessage(message, "admin");
  }
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to show admin typing indicator
function showAdminTyping() {
  adminTyping.style.display = "block";
}

// Function to hide admin typing indicator
function hideAdminTyping() {
  adminTyping.style.display = "none";
}

// Function to generate admin response
function generateAdminResponse(message) {
  // Add your logic here to generate admin response based on user's message
  // For now, let's just return a generic response
  return "Thank you for your message. We will get back to you soon!";
}
chatWidget.style.display = "none";

// Inject the CSS rules into the style element
styleElement.appendChild(document.createTextNode(css));
