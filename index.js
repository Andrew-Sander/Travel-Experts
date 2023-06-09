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
		user: "Team5",
		password: "",
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
z

// app.post("/create-post", (req, res) => {
//     console.log(req.body.name + " " + req.body.phone + " " + req.body.message);
//     res.redirect('thanks');
// });

app.use((req, res) => {
    res.status(404).render('pages/404');
});