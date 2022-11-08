const express = require('express');
const app = express();
const http = require('http')
const server = http.createServer(app)
const port = 3000;

var io = require('socket.io')(server);
app.use(express.static('public'));

// Listen to Static Files
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/javascript', express.static(__dirname + 'public/javascript'));
app.use('/image', express.static(__dirname + 'public/image'));


// Listen to HTML
app.get('', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
})

app.listen(3000,() => console.log('Server running on port 3000'));

