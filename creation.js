const express = require('express');
const fs = require('fs');
const mysql = require('mysql');

const credentials = JSON.parse(fs.readFileSync('credentials.json', 'utf8'));
const connection = mysql.createConnection(credentials);

const service = express();
service.use(express.json());

/************ MIDDLEWARE ************************/
service.use((request, response, next) => {
  response.set('Access-Control-Allow-Origin', '*');
  response.set('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
  response.set("Access-Control-Allow-Headers", "Content-Type");

  next();
});

service.options('*', (request, response) => {
  response.set('Access-Control-Allow-Headers', 'Content-Type');
  response.set('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
  response.sendStatus(200);
});

/*************** P2 ************************** */
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

function rowToChampions(row) {
  return {
    id: row.id,
    name: row.c_name,
    type: row.c_type,
    lane: row.c_role,
    desc: row.c_desc,
  };
}

// Select function for when we have wildcards to account for.
function select(query, params, response) {
  connection.query(query, params, (error, rows) => {
    if (error) {
      response.status(500);
      response.json({
        ok: false,
        results: error.message,
      });
    } else {
      response.json({
        ok: true,
        results: rows.map(rowToChampions),
      });
    }
  });

}

// Select function for when there are no wildcards to account for.
function selectAll(query, response) {
  connection.query(query, (error, rows) => {
    if (error) {
      response.status(500);
      response.json({
        ok: false,
        results: error.message,
      });
    } else {
      response.json({
        ok: true,
        results: rows.map(rowToChampions),
      });
    }
  });
}

// Inserts a new champion into the database.
function insert(query, params, response) {
  connection.query(query, params, (error, result) => {
    if (error) {
      response.status(500);
      response.json({
        ok: false,
        results: error.message,
      });
    } else {
      response.json({
        ok: true,
        results: result.insertId,
      });
    }
  });
}

/****************** SELECTS ********************/

// get all the champions.
service.get('/champions', (request, response) => {
  const query = 'SELECT * FROM champions ORDER BY c_role';
  selectAll(query, response);
});

// get a certain champion from the database. 
service.get('/:champion', (request, response) => {
  const param = [request.params.champion];
  const query = 'SELECT * FROM champions WHERE c_name = ?';

  select(query, param, response);
});

// get a certain role from the database. 
service.get('/role/:role', (request, response) => {
  const param = [request.params.role];
  const query = 'SELECT * FROM champions WHERE c_role = ?';

  select(query, param, response);
});

// get a certain type from the database. 
service.get('/type/:type', (request, response) => {
  const param = [request.params.type];
  const query = 'SELECT * FROM champions WHERE c_type = ?';

  select(query, param, response);
});

/****************** POST *****************/

service.post('/champions', (request, response) => {

  if (request.body.hasOwnProperty('c_name') &&
  request.body.hasOwnProperty('c_type') &&
  request.body.hasOwnProperty('c_role') &&
  request.body.hasOwnProperty('c_desc')) {

    const param = [
      request.body.c_name,
      request.body.c_type,
      request.body.c_role,
      request.body.c_desc
    ];

    const query = 'INSERT INTO champions(c_name, c_type, c_role, c_desc) VALUES (?, ?, ?, ?)';

    insert(query, param, response);
    
  } else {
    response.status(400);
    response.json({
      ok: false,
      results: 'Insufficient champion data.',
    });
  }
});

/****************** UPDATE *********************/
service.patch('/champions/:id', (request, response) => {
  const param = [
    request.body.c_name,
    request.body.c_type,
    request.body.c_role,
    request.body.c_desc,
    parseInt(request.params.id),
  ];

  const query = 'UPDATE champions SET c_name = ?, c_type = ?, c_role = ?, c_desc = ? WHERE id = ?';
  connection.query(query, param, (error, result) => {
    if (error) {
      response.status(404);
      response.json({
        ok: false,
        results: error.message,
      });
    } else {
      response.json({
        ok: true,
      });
    }
  });
});


/****************** DELETE *********************/
service.delete('/champions/:id', (request, response) => {
  const parameters = [parseInt(request.params.id)];

  const query = 'DELETE FROM champions WHERE id = ?';
  connection.query(query, parameters, (error, result) => {
    if (error) {
      response.status(404);
      response.json({
        ok: false,
        results: error.message,
      });
    } else {
      response.json({
        ok: true,
      });
    }
  });
});

/**************** REPORT ************************/
service.get("/report.html", (request, response) => {
  var options = {
    root: path.join(__dirname)
  };

  var fileName = 'report.html';
  response.sendFile(fileName, options, function (err) {
    if (err) {
      next(err);
    } else {
      console.log('Sent:', fileName);
    }
  });
});

/****************** CONNECTION *****************/
const port = 5001;
service.listen(port, () => {
  console.log(`We're live in port ${port}!`);
});


