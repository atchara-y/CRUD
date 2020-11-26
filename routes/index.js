var express = require('express');
var router = express.Router();
var mysql = require('mysql');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'tUsersDB'
})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//test db connection
router.get('/testConnection', function (req, res, next) {
  if (db !== null) {
    res.send('connected!');
  } else {
    res.send('connection failed');
  }
});

// output all users
router.get('/outputAll', function (req, res, next) {
  db.query('SELECT * FROM tUserTable', function (err, response) {
    res.render('outputAll', { tUserTable: response });
  });
})

//render search form
router.get('/searchForm', function(req, res, next) {
  res.render('searchForm');
});

//search result
router.post('/searchForm', function (req, res, next) {
  // console.log(req.body);
  db.query('SELECT * FROM tUserTable WHERE first_name = ? AND last_name = ?', [req.body.first_name, req.body.last_name], function (err, response) {
    // console.log(response);
    res.render('outputSearch', { tUserTable: response[0] });
  })
})

// render insert form
router.get('/addEditForm', function(req, res, next) {
  res.render('addEditForm', { tUserTable: {} });
});

// insert
router.post('/addEditForm', function (req, res, next) {
  // let body = {
  //   username: req.body.username,
  //  first_name: req.body.first_name,
  //   last_name: req.body.last_name,
  //   create_by: req.body.username,
  //   create_date: '26/11/63',
  //   last_update_by: req.body.username,
  //   last_update_date: '26/11/63'
  // }
  db.query('INSERT INTO tUserTable SET ?', req.body, function (err, response) {
    console.log(response);
    res.redirect('/outputAll')
  });
})

//edit
router.get('/edit', function (req, res, next) {
  db.query('SELECT * FROM tUserTable WHERE userId = ?', req.query.userId, function (err, response) {
    console.log(response);
    res.render('addEditForm', { tUserTable: response[0] });
  })
})

//update
router.post('/edit', function (req, res, next) {
  const param = [
    req.body,
    req.query.userId
  ]
  console.log(param);
  db.query('UPDATE tUserTable SET ? WHERE userId = ?', param, function (err, response) {
     res.redirect('/outputAll');
  })
})

//delete
router.get('/delete', function (req, res, next) {
  db.query('DELETE FROM tUserTable WHERE userId = ?', req.query.userId, function (err, response) {
    res.redirect('/outputAll');
  })
})


module.exports = router;
