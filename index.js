const express = require('express');
const app = express();
const path = require('path');
const mysql = require("mysql");

app.set('view engine', 'ejs');

app.listen(3000, (err) => {
    if (err) throw err;
    console.log('server is listening on port 3000');
});

function getDBH() {
    return mysql.createConnection({
        host: "localhost",
        user: "Team5",
        password: "",
        database: "travelexperts"
    });
}

app.use(express.static(__dirname + '/public'));
// app.use(express.static(path.join(__dirname, 'views'), {
//     extensions: ['html']
// }));
app.use(express.urlencoded({ "extended": true}));

app.get('/', (req, res) => {
    res.render('pages/main');
});

app.get('/packages', (req, res) => {
	var dbh = getDBH();
	dbh.connect((err) => {
		if (err) throw err;
		var sql = "SELECT * FROM packages";
		dbh.query(sql, (err, result, fields) => {
			if (err) throw err;
			res.render('pages/packages' , {
				packages: result
			} );
		} );
	} );
});
app.get('/purchasewindow', (req, res) => {
	var dbh = getDBH();
	var sql = "SELECT PkgName FROM packages WHERE PackageId=?"
	dbh.query({"sql": sql, "values": [req.params.id]}, (err, result) => {
		if (err) throw err;
		console.log('got purchasewindow');
		res.render('pages/purchasewindow' , {
			cart: result
		} );
	} );
} );
app.get('/purchasewindow', (req, res) => {
    res.render('pages/purchasewindow');
});

app.get("/contact", (req, res) => {
	var dbh = mysql.createConnection( {
		host: "localhost",
		user: "fred",
		password: "Password",
		database: "travelexperts"
	} );
    dbh.connect((err) => {
        if (err) throw err;
        var sql = "select AgtFirstName, AgtLastName, AgtBusPhone, AgtEmail from agents";
        dbh.query({ "sql": sql, "values": [req.params.id] }, (err, result) => {
            if (err) throw err;
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
app.get('/thanks', (req, res) => {
    res.render('pages/thanks');
});

// app.post("/create-post", (req, res) => {
//     console.log(req.body.name + " " + req.body.phone + " " + req.body.message);
//     res.redirect('thanks');
// });

app.use((req, res) => {
    res.status(404).render('pages/404');
});