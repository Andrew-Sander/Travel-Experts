const express = require('express');
const app = express();
const mysql = require ('mysql');

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
app.use(express.json());
app.use(express.urlencoded({ "extended": true}));

app.get('/', (req, res) => {

    var dbh = getDBH();
    dbh.connect
        (
            (err) => {
                if (err) throw err;
                var sql = "SELECT  TIMESTAMPDIFF(DAY, PkgStartDate, PkgEndDate) as PkgDuration,PkgName, PkgBasePrice FROM packages WHERE PkgBasePrice in (SELECT min(PkgBasePrice) FROM packages)";
                dbh.query(sql, (err, result) => {
                    if (err) throw err;
                    //console.log(result[0].PkgDuration, result[0].PkgName, result[0].PkgBasePrice);
                    //res.render('partials/sales');
                    res.render('pages/main', { "PkgDuration": result[0].PkgDuration, "PkgName": result[0].PkgName, "PkgBasePrice": result[0].PkgBasePrice });
                    dbh.end(
                        (err) => {
                            if (err) throw err;
                            console.log("database connection for main page is successfully disconnected.");
                        }
                    );
                }
                );


            }

        )
}
);


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
		res.render('pages/purchasewindow' , {
			cart: result
		} );
	} );
} );
app.post('/thankyou', (req,res) => {
	res.render('pages/thankyou');
} );
app.get("/contact", (req, res) => {
	var dbh = getDBH();
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
app.get('/welcome', (req, res) => {
    res.render('pages/welcome');
});
app.get('/login', (req, res) => {
    res.render('pages/login');
});

app.post("/register", (request, response) => {

	var dbh = getDBH();

	var CustFirstName = request.body.fname;
	var CustLastName = request.body.lname;
	var CustAddress = request.body.address;
	var CustCity = request.body.city;
	var CustProv = request.body.province;
	var CustPostal = request.body.postal;
	var CustHomePhone = request.body.phone;
	var CustEmail = request.body.email;
	var username = request.body.username;
	var password = request.body.password;

	var usernameQuery = "SELECT * FROM customers WHERE username = ?";
	
	dbh.query({"sql": usernameQuery, "values": [username]}, (err, rows) => {
		if (err) throw err;
		if (rows.length > 0) {
			console.log('username already in use');		
			dbh.end((err) => {
                if (err) throw err;
                console.log("Disconnected from the server");
            });
			response.render('pages/register-error');
		} else {
			var insertQuery = "INSERT INTO customers (CustFirstName, CustLastName, CustAddress, CustCity, CustProv, CustPostal, CustHomePhone, CustEmail, username, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

  			dbh.query({"sql": insertQuery, "values": [CustFirstName, CustLastName, CustAddress, CustCity, CustProv, CustPostal, CustHomePhone, CustEmail, username, password]},  (err, result) => {
    			if (err) throw err;
    			console.log("1 record inserted");
 			});
   			response.render('pages/welcome', {
				CustFirstName: CustFirstName,
				CustAddress: CustAddress,
				CustCity: CustCity,
				CustProv: CustProv,
				CustPostal: CustPostal,
				CustHomePhone: CustHomePhone,
				CustEmail: CustEmail
			});
		}

	});

});

app.post('/login', function(request, response) {
	var dbh = getDBH();

	let username = request.body.username;
	let password = request.body.password;
	
	if (username && password) {
		
		dbh.query('SELECT * FROM customers WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			
			if (error) throw error;

			if (results.length > 0) {
				
				var CustFirstName = results[0].CustFirstName;
				var CustAddress = results[0].CustAddress;
				var CustCity = results[0].CustCity;
				var CustProv = results[0].CustProv;
				var CustPostal = results[0].CustPostal;
				var CustHomePhone = results[0].CustHomePhone;
				var CustEmail = results[0].CustEmail;

				response.render('pages/welcome', {
					CustFirstName: CustFirstName,
					CustAddress: CustAddress,
					CustCity: CustCity,
					CustProv: CustProv,
					CustPostal: CustPostal,
					CustHomePhone: CustHomePhone,
					CustEmail: CustEmail
				});
			} else {
				response.render('pages/login-error');
			}			
			response.end();
		});
	}
});

app.use((req, res) => {
    res.status(404).render('pages/404');
});