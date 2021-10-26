//const express = require('express');
const fs = require('fs');
const mysql = require('mysql');

const credentials = JSON.parse(fs.readFileSync('credentials.json', 'utf8'));
const connection = mysql.createConnection(credentials);

//const create_champion = express();

connection.connect(error => {
    if (error) {
      console.error(error);
      process.exit(1);
    }
  });

const selectQuery = 'SELECT * FROM champions';
connection.query(selectQuery, (error, rows) => {
  if (error) {
    console.error(error);
  } else {
    console.log(rows);
  }
});