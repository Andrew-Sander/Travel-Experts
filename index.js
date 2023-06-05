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