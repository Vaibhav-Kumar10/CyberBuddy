document.addEventListener("DOMContentLoaded", function () {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");
    const verifyBtn = document.getElementById("verify-link-btn");
    const reportBtn = document.getElementById("report-link-btn");

    function appendMessage(sender, message) {
        const msg = document.createElement("div");
        msg.textContent = sender + ": " + message;
        msg.style.padding = "8px";
        msg.style.margin = "5px 0";
        msg.style.borderRadius = "5px";
        msg.style.background = sender === "Bot" ? "#e1f5fe" : "#c8e6c9";
        chatBox.appendChild(msg);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    appendMessage("Bot", "Hi, I am your Cyber Buddy. How can I help you?");

    sendBtn.addEventListener("click", function () {
        const message = userInput.value.trim();
        if (message) {
            appendMessage("You", message);
            fetch("http://127.0.0.1:5000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message })
            })
            .then(response => response.json())
            .then(data => appendMessage("Bot", data.response))
            .catch(() => appendMessage("Bot", "Error connecting to server."));
        }
        userInput.value = "";
    });

    verifyBtn.addEventListener("click", function () {
        const link = prompt("Enter the link to verify:");
        if (link) {
            fetch("http://127.0.0.1:5000/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ link })
            })
            .then(response => response.json())
            .then(data => appendMessage("Bot", data.message))
            .catch(() => appendMessage("Bot", "Verification failed."));
        }
    });

    reportBtn.addEventListener("click", function () {
        const link = prompt("Enter the suspicious link:");
        if (link) {
            const username = prompt("Enter your username:");  // 🔹 Ask for username every time
            if (username) {
                fetch("http://127.0.0.1:5000/report", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ link, username })  // 🔹 Send username along with the link
                })
                .then(response => response.json())
                .then(data => appendMessage("Bot", data.message))
                .catch(() => appendMessage("Bot", "Reporting failed."));
            } else {
                appendMessage("Bot", "❌ Reporting cancelled: Username is required.");
            }
        }
    });
    
});
document.addEventListener("DOMContentLoaded", function () {
    const chatBox = document.getElementById("chat-box");

    // 🔥 Predefined explanations for each tip
    const tipExplanations = {
        "Never share your passwords online.": 
            "🔑 Your password is like a key to your home. If shared, anyone can access your personal data! Always keep it secret and use a password manager.",
        
        "Beware of phishing emails with suspicious links.": 
            "📧 Phishing emails trick you into clicking malicious links. Always check the sender's email and hover over links before clicking!",
        
        "Always check if a website URL is secure (🔒 HTTPS).": 
            "🌐 HTTPS ensures a secure connection between you and the website. If a site only shows HTTP, it may be unsafe to enter sensitive information.",
        
        "Use a strong and unique password for each account.": 
            "🛡️ Using the same password everywhere is dangerous! Hackers can break into all your accounts if one password leaks. Use unique, strong passwords."
    };

    // ✅ Function to display messages in the chatbox
    function displayMessage(message, sender = "bot") {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message");
        messageDiv.classList.add(sender === "bot" ? "bot-message" : "user-message");
        messageDiv.textContent = message;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll
    }

    // ✅ Retrieve stored cyber awareness tip and explain it
    chrome.storage.local.get("currentTip", (data) => {
        if (data.currentTip) {
            const tip = data.currentTip;
            displayMessage(`🔹 Awareness Tip: ${tip}`); // Show the tip
            setTimeout(() => {
                if (tipExplanations[tip]) {
                    displayMessage(`💡 Explanation: ${tipExplanations[tip]}`); // Show explanation
                } else {
                    displayMessage("⚠️ No additional explanation available.");
                }
            }, 2000); // Small delay for a chatbot-like effect
        }
    });

    // ✅ User input handling (for chatbot commands)
    document.getElementById("send-btn").addEventListener("click", function () {
        const userInput = document.getElementById("user-input").value.trim();
        if (userInput) {
            displayMessage(userInput, "user"); // Show user message
            document.getElementById("user-input").value = ""; // Clear input
            setTimeout(() => displayMessage("Processing request... 🔄", "bot"), 500);
        }
    });
});