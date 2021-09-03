const config   = require("./settings.js");
const mysql    = require("mysql");


var connection = mysql.createConnection({
	host               : config.HOST,
	user               : config.USER,
	password           : config.PASSWORD,
	database           : config.DB
});

module.exports = connection;
