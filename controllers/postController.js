const Post = require('../models/Post')


exports.allpostFetch = function(req, res){
 res.json(req.user)
}

exports.createPost = function(req, res){
 let post = new Post(req.body, req.user.LoggedInUserId)
 post.createPost().then(val => res.json(val)).catch(err => res.json(err))
 
}

exports.postDelete = function(req, res){
Post.deletePost(req.params.id, req.user.LoggedInUserId).then((val) => {
res.json("You have successfully deleted the post!")

}).catch((err) => {
res.json("You do not have permission to perform that action!")
})
}
