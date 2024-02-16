// Function to join a lobby
function joinLobby(lobbyId) {
    // Send a message to the server to join the lobby with the specified ID
    socket.send(JSON.stringify({ type: 'join_lobby', data: { lobbyId: lobbyId } }));
}

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
}
