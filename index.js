const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { urlencoded } = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

const url = 'mongodb+srv://kiosk_user:maor1997@cluster0.4l8lk.mongodb.net/kiosk_db?retryWrites=true&w=majority';
mongoose.connect(url)
.then(results => {
    console.log(results);
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);;
    })
})
.catch(err => {
    console.log(err);
})