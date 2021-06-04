const express = require('express');
const app = express();
const PORT = 3000;
const router = require('./routers/router');
const ejs = require('ejs');
const cors = require('cors');

app.use(cors())
app.options('*', cors())


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(router);

app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
})