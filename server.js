require('dotenv').config();

const app = require('http').createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('App init');
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

console.log('before market bot');
const hwMarketBot = require('./src/app.js');
hwMarketBot.start();
