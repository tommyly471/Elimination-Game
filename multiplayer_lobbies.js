// Sets up multiplayer lobbies for players to enter and allows them to enter their name

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mysql = require('mysql');

// Set up the MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'username',
  password: 'password',
  database: 'database_name'
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    return;
  }
  console.log('Connected to the database as id ' + db.threadId);
});

// Set up the lobby creation page
app.get('/create', (req, res) => {
  // Render the lobby creation page
  res.render('create');
});

// Set up the lobby page
app.get('/lobby/:name', (req, res) => {
  // Get the lobby name from the URL
  const lobbyName = req.params.name;
  // Render the lobby page
  res.render('lobby', { lobbyName: lobbyName });
});

// Set up the socket connection
io.on('connection', (socket) => {
  // Handle the 'create lobby' event
  socket.on('create lobby', (data) => {
    // Create a new lobby and store it in the database
    const lobbyName = mysql.escape(data.lobbyName);
    const timer = mysql.escape(data.timer);
    const query = `INSERT INTO lobbies (lobby_name, timer) VALUES (${lobbyName}, ${timer})`;
    db.query(query, (err, result) => {
      if (err) throw err;
      // Join the lobby and update the lobby list
      socket.join(lobbyName);
      io.emit('update lobbies', getLobbies());
    });
  });

  // Handle the 'join lobby' event
  socket.on('join lobby', (data) => {
    // Get the lobby name and display name from the data
    const lobbyName = mysql.escape(data.lobbyName);
    const displayName = mysql.escape(data.displayName);
    // Check if the lobby exists
    const query = `SELECT * FROM lobbies WHERE lobby_name=${lobbyName}`;
    db.query(query, (err, result) => {
      if (err) throw err;
      if (result.length > 0) {
        // Add the player to the lobby
        const lobby = result[0];
        const players = lobby.players ? lobby.players.split(',') : [];
        players.push(displayName);
        const query = `UPDATE lobbies SET players='${players.join(',')}' WHERE lobby_name=${lobbyName}`;
        db.query(query, (err, result) => {
          if (err) throw err;
          // Join the lobby and update the lobby list
          socket.join(lobbyName);
          io.emit('update lobbies', getLobbies());
        });
      } else {
        // Send an error message if the lobby does not exist
        socket.emit('lobby error', 'Lobby does not exist');
      }
    });
  });

  // Handle the 'start game' event
  socket.on('start game', (lobbyName) => {
    // Get the lobby from the database
    const query = `SELECT * FROM lobbies WHERE lobby_name=${mysql.escape(lobbyName)}`;
    db.query(query, (err, result) => {
      if (err) throw err;
      if (result.length > 0) {
        const lobby = result[0];
        // Start the countdown timer
        const timer = lobby.timer;
        let timeLeft = timer;
        const interval = setInterval(() => {
          // Emit the remaining time to the players in the lobby
          io.to(lobbyName).emit('time left', timeLeft);
          timeLeft--;
          // End the game when the timer reaches 0
          if (timeLeft < 0) {
            clearInterval(interval);
            io.to(lobbyName).emit('game over');
          }
        }, 1000);
      }
    });
  });
});

// Get a list of lobbies from the database
function getLobbies() {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM lobbies';
    db.query(query, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
}

// Start the server
http.listen(3000, () => {
  console.log('Listening on port 3000');
});