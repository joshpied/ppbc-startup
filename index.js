const express = require('express');
const mustache = require('mustache-express');
const db = require('./db');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.engine('mustache', mustache());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

// form for startups to sign up
app.get('/', (req, res) => {
  const sql = 'select * from products';
  db.all(sql, (err, rows) => {
    if (err) console.log('No products in db');
    res.render('startup', { products: rows });
  });
});

// admin panel for PPBC
app.get('/ppbc', (req, res) => {
  const sql = 'select * from startups';
  db.all(sql, (err, rows) => {
    if (err) console.log('No startups in db');
    res.render('ppbc', { startups: rows });
  });
});

app.post('/submit', (req, res) => {
  console.log(req.body);
  const startup = { ...req.body, isNew: true };
  const params = [
    startup.name,
    startup.email,
    startup.ceo_name,
    startup.date,
    startup.description,
    startup.employee_count,
    startup.referral,
    new Date().toString(),
    new Date().toString()
  ];
  
  
  // redirect to acknolwdgement view
  db.serialize(() => {
    let sql = 'select * from startups where email = ?';
    db.get(sql, [req.body.email], (err, row) => {
			if (err) return console.error(err.message);
			// check to see if in db -> if yes get id of row and update all fields
      if (row) {
				startup['isNew'] = false;
        console.log('row exists -> needs to be updated');
        sql = `UPDATE startups SET
					name = ?, email = ?, ceo_name = ?, date = ?, description = ?, employee_count = ?, referral = ?, created_at = ?, updated_at = ?
					where email = "${startup.email}"`;
        db.run(sql, params, err => {
          if (err) {
            return console.error(err.message);
          }
          console.log(`Row(s) updated: ${this.changes}`);
				});
				// otherwise create new record with all data
      } else {
        console.log('row doesnt exist yet -> needs to be added');
        sql = `INSERT INTO 
					startups (name, email, ceo_name, date, description, employee_count, referral, created_at, updated_at) 
					VALUES (?,?,?,?,?,?,?,?,?)`;
        db.run(sql, params);
			}
			res.render('submission', startup);
    });
  });
});

app.listen(3000, () => {
  console.log('listening on localhost:3000');
});
