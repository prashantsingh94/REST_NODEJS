const con = require('../db')
//const User = require('./User')
const sanitizeHTML = require('sanitize-html')

let Post = function (data, authorId) {
 this.data = data,
 this.errors = [],
 this.authorId = authorId
}


Post.prototype.cleanUp = function(){
 if(typeof(this.data.title) != "string") this.data.title = ""
 if(typeof(this.data.body)  != "string") this.data.body = ""


 // get rid of any bogus property
 this.data = {
   title: sanitizeHTML(this.data.title.trim(), {allowedTags: [], allowedAttributes:{}}),
   body: sanitizeHTML(this.data.body.trim(), {allowedTags: [], allowedAttributes: {}})
  // author: here you grab the userid of the logged In user
 }

}

Post.prototype.validate = function(){
  if(this.data.title == '')
  this.errors.push("You must provide a title!") 
  
  if(this.data.body == '')
  this.errors.push("You must provide the post content!")
  
}

Post.prototype.createPost = function(){

//console.log(this.authorId)  
return new Promise((resolve, reject) => {

    // Step #1 : First cleanUP the data and  Validate user data
    this.cleanUp()
    this.validate()

   // Step #2 : Only if there are no errors then save user data into a database

    if(this.errors.length){
    reject(this.errors)
    return
    }

  // write the database logics out here
  var sql1 = `INSERT INTO posts (title, body, authorId) VALUES ('${this.data.title}', '${this.data.body}', '${this.authorId}')`;
  //console.log(this.authorId)
  //console.log(sql)
  con.query(sql1, function (err, result) {
    if (err) {
      throw err;
      //reject("Some error occurred!");
    } else {
      console.log("1 record inserted");
      resolve("One Post Created!");
      
    }
  });

})

}

Post.deletePost = function(postId, currentUserId){
return new Promise((resolve, reject) => {

// write the delete logic here
let sql = `DELETE FROM posts WHERE id = '${postId}' AND authorId = '${currentUserId}'` 
con.query(sql, function(err, result){
if(err){
throw err;
}

if(!result.affectedRows) {
reject("Invalid Post Id!");
} 
else {
  console.log("1 Record successfully deleted!")
 // console.log(result.affectedRows)
 // console.log(sql)
 // console.log(postId)
  resolve()
} 

})
})

}

module.exports = Post;
