require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.SERVER_PORT || 3000;

app.use((req, res, next) => {
    console.log(req.method + " " + req.originalUrl);
    next();
});

console.log("Service URL is " + process.env.SERVICE_URL);

app.get('/', (req, res) => {
    res.json({ message: 'Hello World!' });
});

//ESEMPIO DI COME SI DICHIARA UNA ROTTA
app.use('/rotta1', require('./routes/rotta2'));
app.use('/rotta2', require('./routes/adminRoute'));

app.listen(port, () => {
    console.log("App listening on port " + port);
});