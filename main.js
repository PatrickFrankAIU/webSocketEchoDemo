// DOM Elements
const connectBtn = document.getElementById('connect-btn');
const disconnectBtn = document.getElementById('disconnect-btn');
const statusMessage = document.getElementById('status-message');
const chatContainer = document.getElementById('chat-container');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const connectionStatus = document.getElementById('connection-status');

// WebSocket instance
let socket = null;

// Connect to WebSocket server
function connectWebSocket() {
    // Using a free echo WebSocket server for this demo 
    // Normally you would make your own WebSocket server with Node.js
    socket = new WebSocket('wss://echo.websocket.org');
    
    // Connection opened
    socket.addEventListener('open', (event) => {
        updateStatus('Connected to WebSocket server!');
        toggleConnectionState(true);
        addMessage('Connected to chat server', 'system');
    });
    
    // Listen for messages
    socket.addEventListener('message', (event) => {
        const message = event.data;
        addMessage(message, 'received');
    });
    
    // Connection closed
    socket.addEventListener('close', (event) => {
        updateStatus('Disconnected from server.');
        toggleConnectionState(false);
        addMessage('Disconnected from chat server', 'system');
    });
    
    // Connection error
    socket.addEventListener('error', (event) => {
        updateStatus('Error connecting to server!');
        toggleConnectionState(false);
        addMessage('Connection error occurred', 'system');
        console.error('WebSocket error:', event);
    });
}

// Send message via WebSocket
function sendMessage(message) {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(message);
        addMessage(message, 'sent');
        messageInput.value = '';
    } else {
        addMessage('Not connected to server', 'system');
    }
}

// Disconnect WebSocket
function disconnectWebSocket() {
    if (socket) {
        socket.close();
        socket = null;
    }
}

// Update status message
function updateStatus(message) {
    statusMessage.textContent = message;
}

// Toggle UI elements based on connection state
function toggleConnectionState(isConnected) {
    connectBtn.disabled = isConnected;
    disconnectBtn.disabled = !isConnected;
    messageInput.disabled = !isConnected;
    sendBtn.disabled = !isConnected;
    
    if (isConnected) {
        connectionStatus.textContent = 'Connected';
        connectionStatus.className = 'connected';
    } else {
        connectionStatus.textContent = 'Disconnected';
        connectionStatus.className = 'disconnected';
    }
}

// Add message to chat container
function addMessage(message, type) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', type);
    messageElement.textContent = message;
    chatContainer.appendChild(messageElement);
    
    // Auto-scroll to bottom
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Event Listeners
connectBtn.addEventListener('click', () => {
    connectWebSocket();
});

disconnectBtn.addEventListener('click', () => {
    disconnectWebSocket();
});

messageForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const message = messageInput.value.trim();
    if (message) {
        sendMessage(message);
    }
});

// Initialize
updateStatus('Click "Connect" to start chatting.');