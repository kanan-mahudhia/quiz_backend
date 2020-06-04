var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cors = require("cors");
const PORT = process.env.PORT || 3000;

var routes = require('./routes/api');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false, limit: '1000mb' }));

app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

app.use('/', routes);

app.listen(PORT, () => {
    console.log(new Date())
    console.log('Server is running on port ' + PORT);
});