const express = require('express');
const app = express();
const path = require('path');
const mysql = require ('mysql');
const session = require('express-session');

app.set('view engine', 'ejs');

app.listen(3000, (err) => {
    if (err) throw err;
    console.log('server is listening on port 3000');
});

function getDBH() {
    return mysql.createConnection({
        host: "localhost",
        user: "HowardS",
        password: "Password",
        database: "travelexperts"
    });
}
const connection = mysql.createConnection({
    host: "localhost",
    user: "Team5",
    password: "",
    database: "travelexperts"
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to mysql database');
});

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ "extended": true}));
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.get('/', (req, res) => {
    res.render('pages/main');
});



app.get('/purchasewindow', (req, res) => {
    res.render('pages/purchasewindow');
});

app.get("/contact", (req, res) => {
    var dbh = getDBH();
    dbh.connect((err) => {
        if (err) throw err;
        var sql = "select AgtFirstName, AgtLastName, AgtBusPhone, AgtEmail from agents";
        dbh.query({ "sql": sql, "values": [req.params.id] }, (err, result) => {
            if (err) throw err;
            console.log(result)
            res.render('pages/contact', { "result": result });
            dbh.end((err) => {
                if (err) throw err;
                console.log("Disconnected from the server");
            });
        });
    });
});

app.get('/register', (req, res) => {
    res.render('pages/register');
});
app.get('/welcome', (req, res) => {
    res.render('pages/welcome');
});
app.get('/login', (req, res) => {
    res.render('pages/login');
});
app.get('/account', (req, res) => {
    console.log('account account')
});
app.post("/register", (req, res) => {
    console.log(req.body.fname + ", " + req.body.phone);


    res.redirect('/welcome');
});

app.post('/login', function(request, response) {
	
	let username = request.body.username;
	let password = request.body.password;
	
	if (username && password) {
		
		connection.query('SELECT * FROM customers WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			
			if (error) throw error;

			if (results.length > 0) {
				
				request.session.loggedin = true;
				request.session.username = username;
				
				response.redirect('/welcome');
			} else {
				// popups.alert({
                //     content: 'Incorrect Username or Password'
                // });
			}			
			response.end();
		});
	}
});

app.use((req, res) => {
    res.status(404).render('pages/404');
});