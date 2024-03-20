const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 8000;
const scoreFilePath = './score.txt';

const upgrades = {
    clickPowerUp: {
        name: "Click Power Up",
        cost: 10
    },

    clickMultiply: {
        name: "Multiply Clicks",
        cost: 50,
    },


};

app.use(express.static('public'));
app.get('/', (req, res) => {
    res.sendFile(__dirname +'/public'+'/test.html');
});


let score = 0;
let userUpgrades = {};
let clickPower = 1
let multiplyUp = false


if (fs.existsSync(scoreFilePath)) {
    const data = JSON.parse(fs.readFileSync(scoreFilePath, 'utf8'));
    score = data.score || 0;
    clickPower = data.clickPower || 1;
    multiplyUp = data.multiplyUp || false;
}

app.get('/increment', (req, res) => {
    if (multiplyUp === true){
        score += clickPower*2
    }
    else{
        score+= clickPower;
    }
    
    //each str is an element in the array used in the functions of the script
    res.send(`Current score: ${score}`);
});

app.get('/score', (req, res) => {
    res.send(`Current score: ${score}`);
});

app.get('/save', (req, res) => {
    const userData = JSON.stringify({ score, clickPower, multiplyUp, darkUnlock, duckUnlock});
    fs.writeFileSync(scoreFilePath, userData);
    res.send(`Score saved! Current score: ${score}`);
});

app.get('/upgrade/:upgradeName', (req, res) => {
    const upgradeName = req.params.upgradeName;
    const upgrade = upgrades[upgradeName];
        userUpgrades[upgradeName] = upgrade;

    if (score >= upgrade.cost) {
        score -= upgrade.cost;
        // Apply the upgrade
        if (upgradeName === 'clickPowerUp'){
            clickPower++;
        }
        else if (upgradeName === 'clickMultiply'){
            multiplyUp = true;
        }

        res.send(`Upgrade "${upgrade.name}" purchased!`);
    } else {
        res.send('Upgrade purchase failed. Invalid upgrade or insufficient score.');
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});