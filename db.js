const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const DBFILE = 'startup_intake.db';
let db = new sqlite3.Database(DBFILE);

if (!fs.existsSync('startup_intake.db')) {
  db.serialize(() => {
    db.run(`
		CREATE TABLE startups (
			id INTEGER PRIMARY KEY AUTOINCREMENT, 
			name TEXT,
			email TEXT,
			ceo_name TEXT,
			date TEXT,
			description TEXT,
			employee_count NUMBER,
			referral TEXT,
			created_at TEXT,
			updated_at TEXT
		)
	`);
	db.run(`
		CREATE TABLE products (
			id INTEGER PRIMARY KEY AUTOINCREMENT, 
			name TEXT,
			description TEXT,
			logo TEXT,
			go_live_date TEXT,
			created_at TEXT,
			updated_at TEXT
		)
	`);
	db.run(`
		CREATE TABLE startup_products (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			product_id INTEGER,
			startup_id INTEGER
		)
	`);
    const sql =
      'INSERT INTO products (name, description, logo, go_live_date, created_at, updated_at) VALUES (?,?,?,?,?,?)';
    const params = [
      [
        'Credit Cards',
        'PPBC offers many credit card products to help your business go into debt quickly.',
        'https://assets.bettyblocks.com/ac68b0ae2-1a84f12f004042b6a0ee6216098f2486/2/credit_card_PNG207.png',
        '2020-02-04',
        new Date().toString(),
        new Date().toString()
      ],
      [
        'Checking Accounts',
        'PPBC offers many checking accounts that charge you feeds for every type of transaction.',
        'https://assets.bettyblocks.com/ac68b0ae2-1a84f12f004042b6a0ee6216098f2486/3/256-2565482_checking-account-png-transparent-png.png',
        '2019-11-11',
        new Date().toString(),
        new Date().toString()
      ],
      [
        'Mortgages',
        'Get a mortgage for your new company headquarters. You will be playing in the big leagues.',
        'https://assets.bettyblocks.com/ac68b0ae2-1a84f12f004042b6a0ee6216098f2486/4/cq5dam.web.767.767.png',
        '2019-07-08',
        new Date().toString(),
        new Date().toString()
      ],
      [
        'Savings Accounts',
        'Save your money in this account. It will help save up for your upcoming takeover bids.',
        'https://assets.bettyblocks.com/ac68b0ae2-1a84f12f004042b6a0ee6216098f2486/5/savings-account-bank-deposit-account-png-favpng-aRwDxXVKfNu35gArHHhC7vwsW.jpg',
        '2018-07-25',
        new Date().toString(),
        new Date().toString()
      ]
    ];
    params.forEach(param => {
      db.run(sql, param);
    });
  });
}

module.exports = db;
