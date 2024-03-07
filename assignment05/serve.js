const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 8000;
const scoreFilePath = './score.txt';

//acesses the public folder, I got this from:
//https://stackoverflow.com/questions/56808188/live-server-not-loading-css
app.use(express.static('public'));
app.get('/', (req, res) => {
    res.sendFile(__dirname +'/public'+'/test.html');
});

let score = 0;
if (fs.existsSync(scoreFilePath)) {
    score = parseInt(fs.readFileSync(scoreFilePath, 'utf8')) || 0;
}

app.get('/increment', (req, res) => {
    score++;
    //each str is an element in the array used in the functions of the script
    res.send(`Current score: ${score}`);
});

app.get('/score', (req, res) => {
    res.send(`Current score: ${score}`);
});

app.get('/save', (req, res) => {
    fs.writeFileSync(scoreFilePath, score.toString());
    res.send(`Score saved! Current score: ${score}`);
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});