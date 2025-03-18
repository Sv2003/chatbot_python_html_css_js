let currentUser = null;
let isVoiceOverEnabled = false;

// Event Listeners
document.getElementById('login-btn').addEventListener('click', login);
document.getElementById('signup-btn').addEventListener('click', signup);
document.getElementById('show-signup').addEventListener('click', showSignup);
document.getElementById('show-login').addEventListener('click', showLogin);
document.getElementById('logout-btn').addEventListener('click', logout);
document.getElementById('history-btn').addEventListener('click', toggleHistory);
document.getElementById('voice-over-btn').addEventListener('click', toggleVoiceOver);
document.getElementById('share-btn').addEventListener('click', shareChat);
document.getElementById('file-input').addEventListener('change', handleFileUpload);
document.getElementById('send-btn').addEventListener('click', sendMessage);
document.getElementById('voice-search-btn').addEventListener('click', startVoiceSearch);
document.getElementById('user-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Login Function
function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const user = JSON.parse(localStorage.getItem(username));

    if (user && user.password === password) {
        currentUser = username;
        showChatPage();
        greetUser(username);
    } else {
        alert('Invalid username or password');
    }
}

// Signup Function
function signup() {
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;

    if (localStorage.getItem(username)) {
        alert('Username already exists');
    } else {
        localStorage.setItem(username, JSON.stringify({ username, password, history: [] }));
        alert('Signup successful! Please login.');
        showLogin();
    }
}

// Show Signup Form
function showSignup() {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('signup-form').classList.remove('hidden');
}

// Show Login Form
function showLogin() {
    document.getElementById('signup-form').classList.add('hidden');
    document.getElementById('login-form').classList.remove('hidden');
}

// Show Chat Page
function showChatPage() {
    document.getElementById('auth-page').classList.add('hidden');
    document.getElementById('chat-page').classList.remove('hidden');
    loadHistory();
}

// Logout Function
function logout() {
    currentUser = null;
    document.getElementById('chat-page').classList.add('hidden');
    document.getElementById('auth-page').classList.remove('hidden');
}

// Toggle Search History
function toggleHistory() {
    const historyList = document.getElementById('history-list');
    historyList.classList.toggle('hidden');
}

// Toggle Voice Over
function toggleVoiceOver() {
    isVoiceOverEnabled = !isVoiceOverEnabled;
    const voiceOverBtn = document.getElementById('voice-over-btn');
    voiceOverBtn.classList.toggle('active', isVoiceOverEnabled);
    alert(`Voice-over is ${isVoiceOverEnabled ? 'enabled' : 'disabled'}`);
}

// Share Chat Function
function shareChat() {
    const chatContent = document.getElementById('chat-box').innerText;
    if (navigator.share) {
        navigator.share({
            title: 'Chatbot Conversation',
            text: chatContent,
        });
    } else {
        alert('Sharing is not supported in this browser.');
    }
}

// Handle File Upload
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const chatBox = document.getElementById('chat-box');
        const fileMessage = document.createElement('div');
        fileMessage.classList.add('message', 'user');
        fileMessage.innerHTML = `<p>Uploaded file: ${file.name}</p>`;
        chatBox.appendChild(fileMessage);
    }
}

// Send Message Function
function sendMessage() {
    const userInput = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');

    if (userInput.value.trim() === '') {
        return;
    }

    // Append User Message
    const userMessage = document.createElement('div');
    userMessage.classList.add('message', 'user');
    userMessage.innerHTML = `<p>${userInput.value}</p>`;
    chatBox.appendChild(userMessage);

    // Save to History
    saveToHistory(userInput.value);

    // Simulate Bot Response
    setTimeout(() => {
        const botMessage = document.createElement('div');
        botMessage.classList.add('message', 'bot');
        const botResponse = `You said: "${userInput.value}"`;
        botMessage.innerHTML = `<p>${botResponse}</p>`;
        chatBox.appendChild(botMessage);

        // Speak the Bot's Response if Voice Over is Enabled
        if (isVoiceOverEnabled) {
            speakText(botResponse);
        }

        // Scroll to the Bottom of the Chat Box
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 500);

    // Clear Input Field
    userInput.value = '';
}

// Start Voice Search
function startVoiceSearch() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.start();

    recognition.onresult = function (event) {
        const transcript = event.results[0][0].transcript;
        document.getElementById('user-input').value = transcript;
        sendMessage();
    };

    recognition.onerror = function (event) {
        console.error('Voice recognition error:', event.error);
        alert('Voice recognition failed. Please try again.');
    };
}

// Save to History
function saveToHistory(query) {
    const user = JSON.parse(localStorage.getItem(currentUser));
    user.history.push(query);
    localStorage.setItem(currentUser, JSON.stringify(user));
    loadHistory();
}

// Load History
function loadHistory() {
    const user = JSON.parse(localStorage.getItem(currentUser));
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';

    if (user && user.history) {
        user.history.forEach(query => {
            const li = document.createElement('li');
            li.textContent = query;
            li.addEventListener('click', () => {
                document.getElementById('user-input').value = query;
            });
            historyList.appendChild(li);
        });
    }
}

// Speak Text
function speakText(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
    } else {
        console.error('Speech synthesis not supported in this browser.');
    }
}

// Greet User
function greetUser(username) {
    const chatBox = document.getElementById('chat-box');
    const botMessage = document.createElement('div');
    botMessage.classList.add('message', 'bot');
    botMessage.innerHTML = `<p>Welcome, ${username}! How can I assist you today?</p>`;
    chatBox.appendChild(botMessage);

    if (isVoiceOverEnabled) {
        speakText(`Welcome, ${username}! How can I assist you today?`);
    }
}