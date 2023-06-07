const express = require('express');
const app = express();
const path = require('path');

app.set('view engine', 'ejs');

app.listen(3000, (err) => {
    if (err) throw err;
    console.log('server is listening on port 3000');
});

app.use(express.static(__dirname + '/public'));
// app.use(express.static(path.join(__dirname, 'views'), {
//     extensions: ['html']
// }));
app.use(express.urlencoded({ "extended": true}));

app.get('/', (req, res) => {
    res.render('pages/main');
});

app.get('/packages', (req, res) => {
    res.render('pages/packages');
});

app.get('/purchasewindow', (req, res) => {
    res.render('pages/purchasewindow');
});

app.get('/contact', (req, res) => {
    res.render('pages/contact');
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
app.post("/register", (req, res) => {
    console.log(req.body.fname + ", " + req.body.phone);
    res.redirect('/welcome');
});
// http://localhost:3000/auth
app.post('/login', function(request, response) {
	// Capture the input fields
	let username = request.body.username;
	let password = request.body.password;
	// Ensure the input fields exists and are not empty
	if (username && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('SELECT * FROM customers WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				request.session.loggedin = true;
				request.session.username = username;
				// Redirect to home page
				
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.use((req, res) => {
    res.status(404).render('pages/404');
});