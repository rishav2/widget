"use strict";
let baseUrl = "http://localhost:3030/api";
let selectedRating = 0;
function e() {
  return document.currentScript
    ? document.currentScript
    : document.querySelector("script[jv-id]") ||
        document.querySelector("script[data-jv-id]");
}

async function fetchChatSettings() {
  const url = e().src;
  const regex = /\/widget\/([A-Za-z0-9]+)/;
  const match = regex.exec(url);

  let configuration = {};
  let chatId;

  if (match && match[1]) {
    const widgetId = match[1];
    try {
      function checkSessionStorage() {
        const storeData = sessionStorage.getItem("userData");
        if (storeData) {
          const userData = JSON.parse(storeData);
          const name = userData.name;
          const email = userData.email;

          if (!name || !email || !userData.chatId) {
            return false;
          }
          chatId = userData.chatId;
        }
      }
      checkSessionStorage();
      const res = await fetch(
        `${baseUrl}/auth/user/chatbotsetting/${widgetId}`
      );
      console.log(res);
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const config = await res.json();
      configuration = config.setting.styling;
      console.log(configuration);

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
                <div class='chat_avatar_box'>
                  <img class="chat_avatar" src=${configuration.avatar} />
                  <span class="chat-title">${
                    configuration.title || "Chat Assistant"
                  }</span>
                </div>
                <button class="close-chat"><i class="fas fa-times"></i></button>
              </div>
              <div class="message admin wel" >
              welcome
              </div>
              <div class="formDiv">
              <form id="user-form" class="message admin">
              <div id="form-input">
                  <input class="input-form" type="text" id="name" name="name" placeholder="Name" required > </input>
              </div>
              <div id="form-input">
                  <input class="input-form" type="email" id="email" name="email" placeholder="Email" required >
              </div>
              <div>
                  <button type="submit" id="continue-button">Continue</button>
              </div>
              </form>
              </div>
              <div id="chat-messages"></div>
              <div id="chat-input">
                <input type="text"  id="message-input" placeholder="Type your message..." />
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
              --main-color: ${configuration.themeColor};
              --second-color: ${configuration.themeColor};
              --third-color: ${configuration.themeColor};
              --fourth-color: ${configuration.themeColor};
            }
        
            .chat_avatar_box{
              display: flex;
              align-items: center;
              gap: 1rem;
            }
        
            .chat_avatar{
              width: 30px;
              height: 30px;
              border-radius: 50%;
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
              display:none;
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
              display:none;
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
              color: white;
              font-weight: bold;
            }
        
            .processing-icon {
              margin-right: 5px;
            }

            .formDiv {
              margin: 10px;
            }
            .wel{
              margin: 10px;
            }

            #form-input {
              padding: 5px;
            }

            .input-form {
              width: 95%;
              padding: 5px;
              outline: none;
              margin-top: 2px;
            }

            #continue-button {
              margin-left: 5px;
              margin-top: 5px;
              padding: 5px;
              color: var(--main-color);
              font-weight: 600;
              // background-color: var(--main-color);
            }
            .processing_gif{
              width: 100px;
              height:40px;
              border: 1px solid var(--main-color);
              border-radius:10px;
              background: #f5f5f5;
            }
             .rating-container {
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 24px;
              cursor: pointer;
              margin: 10px;
              flex-direction: column;
            }

            .rating-container span {
              margin: 0px;
            }
            .rated {
              color: orange;
            }
            #submitBtn {
            margin-top: 10px;
            padding: 8px 16px;
            font-size: 16px;
            cursor: pointer;
            }
             #send-button:disabled {
              background-color: #cccccc;
              color: #626262;
              cursor: not-allowed;
            }

             .loader-container {
            text-align: center;
        }

      .dots_container {
            font-family: Arial, sans-serif;
            background-color: white;
             margin-bottom: 10px;
              padding: 10px;
              margin-right:280px;
              border-radius: 10px;
              text-align: left;
              color: gray;
              font-weight: bold;
              border: 2px solid var(--main-color);   
              width:60px;           

        }

        .dots {
            display: inline-block;
        }

        .dot {
            display: inline-block;
            width: 10px;
            height: 10px;
            background-color: #333;
            border-radius: 50%;
            margin: 0 3px;
            opacity: 0;
            animation: blink 1.5s infinite;
        }

        .dot:nth-child(2) {
            animation-delay: 0.5s; 
        }

        .dot:nth-child(3) {
            animation-delay: 1s;
        }

        @keyframes blink {
            0%, 100% { opacity: 0; }
            50% { opacity: 1; }
        }
            
              `;

      /*begin star rating */

      /*end */

      let messages = [];

      const loadingIconHTML = `<div class="loader-container">
         <p class="dots_container">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
        </span></p>
    </div>`;

      messages.push({ message: configuration.message, sender: "admin" });
      let isLoggedIn = false; // Variable to track user login status

      // Get DOM elements
      const chatWidgetContainer = document.querySelector(
        ".chat-widget-container"
      );
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
      // messageInput.addEventListener("keypress", handleTyping);
      messageInput.addEventListener("input", handleTyping);

      const user_form = document.querySelector("#user-form");
      user_form.addEventListener("submit", initializeChat);

      console.log({ chatId });
      if (chatId) hideForm();
      function hideForm() {
        user_form.style.display = "none";
        messageInput.style.display = "block";
        sendButton.style.display = "block";
      }

      async function initializeChat(e) {
        try {
          e.preventDefault();
          const name = user_form.querySelector("#name").value;
          const email = user_form.querySelector("#email").value;
          const userData = {
            name: name,
            email: email,
            userId: widgetId,
          };

          const res = await fetch(`${baseUrl}/chat/initializechat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
          });
          const data = await res.json();
          chatId = data.chatId;
          console.log({ chatId });
          userData.chatId = chatId;
          sessionStorage.setItem("userData", JSON.stringify(userData));
          hideForm();
        } catch (error) {
          console.log("Error while initailizing chat", error);
        }
      }

      // Function to open the chat
      function openChat() {
        chatWidget.style.display = "block";
        openChatButton.style.display = "none";
      }

      // Function to close the chat
      function closeChat() {
        // alert('Rate chat before closing chats');
        let ratingContainer = chatMessages.querySelector("#ratingContainer");
        if (!ratingContainer) appendRatingContainer();
        else {
          chatWidget.style.display = "none";
          openChatButton.style.display = "block";
          // ratingContainer.style.display = 'block';
        }
        // chatWidget.style.display = 'none';
        // openChatButton.style.display = 'block';
        // ratingContainer.style.display = 'block';
      }

      function appendRatingContainer() {
        const chatMessages = document.querySelector("#chat-messages");
        chatMessages.innerHTML += `<div class="rating-container message admin" id="ratingContainer" >
                <div class="new-line">
                    <h5>Please Rate the Chat </h5>
                </div>
                <div class="new-line">
                <span class="star" data-value="1">&#9733;</span>
                <span class="star" data-value="2">&#9733;</span>
                <span class="star" data-value="3">&#9733;</span>
                <span class="star" data-value="4">&#9733;</span>
                <span class="star" data-value="5">&#9733;</span>
                </div>
                <div class="new-line">
                  <button id="submitBtn" class='message admin' onclick="submitRating()">Submit Rating</button>
                </div>
              </div>`;
        appendRatingContainer2();
      }

      // Function to send a message
      async function sendMessage() {
        const message = messageInput.value;

        if (!chatId) return;

        // Append the message to the chat messages with user's alignment
        appendMessage(message, "user");

        // Clear the input field
        messageInput.value = "";
      }

      // Function to handle typing event
      function handleTyping(event) {
        console.log({ chatId });
        console.log(event);
        if (!chatId) {
          event.target.value = "";
          return alert("Please enter email and name");
        }
        if (event.key === "Enter") {
          sendMessage();
        }
      }

      function appendWelcomeMessage(message) {
        messages.push({ sender: "admin", message });
        const messageElement = document.createElement("div");
        messageElement.classList.add("message", "admin");
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
      }
      // appendWelcomeMessage(configuration.message);

      async function addMessageToChat(sender, content, userId) {
        try {
          const res = await fetch(`${baseUrl}/chat/messages`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sender,
              content,
              userId,
              chatId: chatId,
            }),
          });
        } catch (error) {
          console.log("Error while saving message", error);
        }
      }
      // submit rating
      async function addratingToChat(rating) {
        try {
          const res = await fetch(`${baseUrl}/chat/ratechat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              rating,
              chatId: chatId,
            }),
          });
        } catch (error) {
          console.log("Error while saving message", error);
        }
      }

      // Function to append a message to the chat messages
      // Update the appendMessage function as follows:
      async function appendMessage(message, sender) {
        console.log({ message, sender });
        messages.push({ sender, message });
        localStorage.setItem("messages", JSON.stringify(messages));
        const messageElement = document.createElement("div");

        // Add the processing icon for admin messages
        if (sender === "admin") {
          sendButton.disabled = true;

          function showLoadingIcon() {
            const loadingContainer = document.createElement("div");
            loadingContainer.classList.add("loader-container");
            loadingContainer.innerHTML = `<p class="dots_container ">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
    </span></p>`;
            messageElement.insertBefore(
              loadingContainer,
              messageElement.firstChild
            );
          }
          function hideLoadingIcon() {
            const loadingContainer =
              document.querySelector(".loader-container");
            if (loadingContainer) {
              loadingContainer.remove();
            }
          }

          const processingIcon = document.createElement("iframe");

          processingIcon.classList.add("processing_gif");
          processingIcon.setAttribute(
            "src",
            "https://lottie.host/?file=c3d73653-86e1-4e6b-9a5b-0a1342b90211/wSPGJ4REd6.json"
          );
          // processingIcon.classList.add('processing-icon');
          // processingIcon.innerHTML =
          //   '<iframe src="https://lottie.host/?file=c3d73653-86e1-4e6b-9a5b-0a1342b90211/wSPGJ4REd6.json"></iframe>';
          // messageElement.insertBefore(
          //   processingIcon,
          //   messageElement.firstChild
          // );
          // messageElement.classList.add('message', sender);
          showLoadingIcon();
          chatMessages.appendChild(messageElement);

          // Asking query
          const response = await fetch(`${baseUrl}/chat/ask`, {
            method: "POST",
            headers: {
              authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAYWRtaW4uY29tIiwiaWF0IjoxNjg4NDgwNTE2fQ.G_-oxFG7dZHhI9cwvJeEKJsaiqgJYxSOwoOkhOyybE8",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ query: message, collectionName: widgetId }),
          });
          const result = await response.json();
          console.log(result);
          messageElement.classList.add("message", sender);
          messageElement.innerHTML = "";
          messageElement.textContent = result.answer;
          hideLoadingIcon();
          sendButton.disabled = false;
          addMessageToChat("AI", result.answer, widgetId);
        }

        if (sender === "user") {
          messageElement.textContent = message;
          messageElement.classList.add("message", sender);
          chatMessages.appendChild(messageElement);
          appendMessage(message, "admin");
          addMessageToChat("user", message, widgetId);
          sendButton.disabled = true;
        }
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
      // chatWidget.style.display = 'none';

      /*star rating begin */
      function appendRatingContainer2() {
        let ratingContainer = document.getElementById("ratingContainer");
        // ratingContainer.style.display = 'none';

        var stars = document.querySelectorAll(".star");
        stars.forEach(function (star) {
          star.addEventListener("click", function () {
            selectedRating = parseInt(this.getAttribute("data-value"));
            stars.forEach(function (innerStar) {
              innerStar.classList.remove("rated");
            });
            for (var i = 1; i <= selectedRating; i++) {
              stars[i - 1].classList.add("rated");
            }
          });
        });
        window.submitRating = function () {
          // Use the selectedRating variable as needed (send to the server, etc.)
          console.log(chatId, "chatId");
          if (!chatId) return;
          addratingToChat(selectedRating);
          console.log("Rating submitted: " + selectedRating);
          // console.log(chatId,'chatId')
          selectedRating = 0;
          stars.forEach(function (star) {
            star.classList.remove("rated");
          });

          ratingContainer.style.display = "none";
          chatWidget.style.display = "none";
          openChatButton.style.display = "block";
        };
      }
      /*star rating end */

      // Inject the CSS rules into the style element
      styleElement.appendChild(document.createTextNode(css));
      chatWidget.style.display = "none";
    } catch (error) {
      console.error("Error:", error);
    }
  } else {
    console.log("Widget ID not found in the URL.");
  }
}

// Call the fetchChatSettings function
fetchChatSettings();
