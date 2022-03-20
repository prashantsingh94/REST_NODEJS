const dotenv = require('dotenv')
dotenv.config()

const mysql = require('mysql');
// create Connection
const con = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'nodemysql' 
  })
  
  con.connect((err) => {
    if (err) {
      console.error('Error connecting: ' + err.sqlMessage);
      //console.log(con)
      return;
    }
  
    console.log('connected as id ' + con.threadId);
  });

module.exports = con
//console.log(con)
  
const app = require('./app')

app.listen(process.env.PORT, () => console.log('Server is running on port:%s', process.env.PORT))