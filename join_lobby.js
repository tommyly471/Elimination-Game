// Function to join a lobby
function joinLobby(lobbyId) {
    // Send a message to the server to join the lobby with the specified ID
    socket.send(JSON.stringify({ type: 'join_lobby', data: { lobbyId: lobbyId } }));

    // Show loading indicator while waiting for response
    showLoading();
}

// Function to handle button click event for joining the lobby
document.getElementById('joinButton').addEventListener('click', function() {
    const lobbyCode = document.getElementById('lobbyCodeInput').value;
    if (lobbyCode.trim() !== '') {
        joinLobby(lobbyCode);
    } else {
        alert('Please enter a lobby code.');
    }
});

// Event listener for messages from the server
socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    console.log('Message from server:', message);

    // Handle different message types from the server
    switch (message.type) {
        // Handle the response to joining a lobby
        case 'lobby_joined':
            handleLobbyJoined(message.data);
            break;
        // Add more cases for other message types
        default:
            console.warn('Unknown message type:', message.type);
    }
});

// Function to handle lobby joined event
function handleLobbyJoined(data) {
    // Example: Redirect to the lobby UI or update the UI to display the lobby details
    console.log('Joined lobby:', data.lobbyId);
    // Example: Redirect to the lobby UI
    window.location.href = `/lobby/${data.lobbyId}`;

    // You can also hide loading indicator here if needed
}

// Function to show loading indicator
function showLoading() {
    // Replace this with your own implementation to show a loading indicator
    console.log('Loading...');
    // For example, you can display a spinner or change the UI to indicate loading
}

// Function to show start button
function showStartButton() {
    // Replace this with your own implementation to show a start button
    console.log('Show start button...');
    // For example, you can create a button element and append it to the UI
    const startButton = document.createElement('button');
    startButton.textContent = 'Start Game';
    startButton.addEventListener('click', () => {
        // Add logic to handle start game event
        console.log('Starting game...');
    });
    // Append start button to a container element in your UI
    document.body.appendChild(startButton);
}

// Function to check if all players have joined
function allPlayersJoined() {
    // Replace this with your own logic to check if all players have joined
    // For example, you can keep track of the number of players who joined and compare it to the total expected number of players
    return true; // Assuming all players have joined for now
}

// Check if all players have joined to show the start button
if (allPlayersJoined()) {
    showStartButton();
}
