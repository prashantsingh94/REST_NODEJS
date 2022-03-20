const con = require("../db");
const validator = require('validator')
var usernameTaken = 0
let User = function (data) {
  this.data = data;
  this.errors = [];
};

User.prototype.cleanUp = function(){
  if(typeof(this.data.username)!= "string")
   this.data.username = ""
  if(typeof(this.data.email) != "string")
   this.data.email = ""
  if(typeof(this.data.password) != "string") 
   this.data.password = ""

   // get rid of any bogus property
   this.data = {
     username: this.data.username.trim().toLowerCase(),
     email   : this.data.email.trim().toLowerCase(),
     password: this.data.password
   }


} 


User.prototype.validate  = function(){

if(this.data.username == '')
   this.errors.push("You must provide a username!")
  if(this.data.username != '' && !validator.isAlphanumeric(this.data.username))
   this.errors.push("Username can only contain letters and numbers!")
  if(this.data.email == '')
   this.errors.push("You must provide an email address!")
  if(this.data.email != '' && !validator.isEmail(this.data.email))
   this.errors.push("You must provide a valid email address!")
  if(this.data.password == "")
   this.errors.push("You must provide a password!")
  if(this.data.password.length != "" && (this.data.password.length < 8 || this.data.password.length > 15))
   this.errors.push("Your passwrod length can not exceed more than 15 characters and lesser than 8 characters!")
  if(this.data.username.length != "" && (this.data.username.length < 6 || this.data.username.length > 20))
   this.errors.push("Your username length can not exceed more than 20 characters and lesser than 6 characters!")
}

// Check to see if the user entered username is already taken
User.prototype.checkUserAvailability =  function (username) {
  return new Promise((resolve, reject) => {
   let sql = `SELECT username FROM users WHERE username = '${username}'`;
   con.query(sql,  function(err , result){
    return err ? reject(err) : resolve(result);
    })
  })
 }

// Check to see if the user entered email is already taken
User.prototype.checkEmailAvailability =  function (email) {
  return new Promise((resolve, reject) => {
   let sql = `SELECT * FROM users WHERE email = '${email}'`;
   con.query(sql,  function(err , result){
    return err ? reject(err) : resolve(result);
    })
  })
 }

User.prototype.register = function () {
  return new Promise(async (resolve, reject) => {
    // Step #1 : Validate user data
    this.cleanUp()
    this.validate()

    await this.checkUserAvailability(this.data.username).then((res) => {
      //console.log(res)
      if(res.length > 0 )
      this.errors.push("This username is already taken!")
    }).catch((e) => {
      //console.log(e.sqlMessage)
      this.errors.push(`Error In SQL Query: ${e.sqlMessage}`)
     })

     await this.checkEmailAvailability(this.data.email).then((res) => {
      //console.log(res)
      if(res.length > 0 )
      this.errors.push("This email is already taken!")
    }).catch((e) => {
      //console.log(e.sqlMessage)
      this.errors.push(`Error In SQL Query: ${e.sqlMessage}`)
     })

  
  // Step #2 : Only if there are no errors then save user data into a database
    // console.log(this.errors)
     if(this.errors.length){
       reject(this.errors)
          return
        }
    
  // write the database logics out here
    var sql = `INSERT INTO users (username, email, password) VALUES ('${this.data.username}', '${this.data.email}', '${this.data.password}')`;
    con.query(sql, function (err, result) {
      if (err) {
        //throw err;
        reject("Some error occurred!");
      } else {
        console.log("1 record inserted");
        resolve("You have been registered!");
      }
    });

  
    

  });
};

User.prototype.login = function () {
  return new Promise((resolve, reject) => {
    if(this.data.username == '' || this.data.password == '')
    reject('Please enter your username / passwrod!')
    let sql = `SELECT id, username, password from users WHERE username = '${this.data.username}' AND password = '${this.data.password}'`;
    con.query(sql, function (err, result) {
      if (err) {
        //throw err;
        reject('Error :'+ err.message)
        return;
      }
      //console.log(result[0].id)
      if (result.length) {
        // user entered the right crendentials
        //resolve("Congrats!");
        resolve(result[0].id); // on success, we pass the id
      } else {
        // user entered the wrong crendentials
        reject("Invalid username / password!");
      }
    });
  });
};

module.exports = User;
