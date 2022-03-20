const apiRouter = require("express").Router();
const cors = require("cors");
const multer = require("multer");
const upload = multer();

const authServer = require("./authServer");
const userController = require("./controllers/userController");
const postController = require("./controllers/postController");

apiRouter.get("/", (req, res) => {
  res.send("Hello World!!");
});

// user related routes
apiRouter.post("/register", upload.none() , userController.register);
apiRouter.post("/login", upload.none(), userController.login);

// Posts related routes
apiRouter.get("/posts", upload.none(), authServer.apiMustBeLoggedIn, postController.allpostFetch);
apiRouter.post("/create/post", upload.none(), authServer.apiMustBeLoggedIn, postController.createPost)
apiRouter.delete('/delete/post/:id', upload.none(),  authServer.apiMustBeLoggedIn, postController.postDelete)
apiRouter.get('/postsByAuthor/:author', userController.getpostByAuthor)


module.exports = apiRouter;
