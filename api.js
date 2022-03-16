const express = require('express');
const router = express.Router()


const registerController = require('./controllers/registerController');
const loginController = require('./controllers/loginController');
const movieController = require('./controllers/movieController');
const reviewController = require('./controllers/reviewController');
const userUpdateController = require('./controllers/userUpdateController');
const emailController = require('./controllers/emailController');
const { requireSignin, isAuth, restrictTo,checkProductId,checkUser,adminChecking, isAuthForAdmin, isAuthForSubAdmin, userVerification } = require('./middleware/authorized');
const { userById } = require('./middleware/checking');

// REGISTER
router.post("/user/register", registerController.registerUser);
router.post("/admin/register",registerController.registerUser); //Admins should be verified manually for security purposes

// LOGIN
router.post("/user/login",loginController.userLogin);

// USER-UPDATE-PERSONAL-INFO    
router.post("/user/:userId/edit", userVerification ,userById, requireSignin, isAuth, userUpdateController.editUserDetails);
router.get("/user/:userId/deleteUser", userVerification ,userById, requireSignin, isAuth, userUpdateController.deleteUser);
router.get("/user/:userId/view", userVerification,userById, requireSignin, isAuth, userUpdateController.userDetailsView)

// ADD, UPDATE AND DELETE MOVIE ONLY RESTRICT TO ADMIN
router.post("/admin/:userId/movie/add", userVerification ,userById, requireSignin, isAuth, restrictTo("admin"),movieController.addMovie);
router.post("/admin/:userId/movie/:movieId/edit", userVerification ,userById, requireSignin, isAuth, restrictTo("admin"),movieController.editMovieDetails);
router.get("/admin/:userId/movie/:movieId/delete", userVerification ,userById, requireSignin, isAuth, restrictTo("admin"),movieController.deleteMovie);
router.get("/admin/:userId/movie/:movieId/show", userVerification ,userById, requireSignin, isAuth,movieController.findMovie)

// ADD, UPDATE AND DELETE REVIEW 
router.post("/user/:userId/review/:movieId/add", userVerification ,userById, requireSignin, isAuth, reviewController.addReview);
router.post("/user/:userId/review/:movieId/edit", userVerification ,userById, requireSignin, isAuth, reviewController.editReviewDetails);
router.get("/user/:userId/review/:movieId/delete", userVerification ,userById, requireSignin, isAuth, reviewController.deleteReview);


// ADMIN TO UPDATE AND DELETE REVIEW
router.post("/admin/:userId/review/:reviewId/edit", userVerification ,userById, requireSignin, isAuth,restrictTo("admin") ,reviewController.editReviewByAdmin);
router.get("/admin/:userId/review/:reviewId/delete", userVerification ,userById, requireSignin, isAuth,restrictTo("admin") ,reviewController.deleteReviewByAdmin);

// EMAIL VERIFICATION OF USERS O-AUTH
router.get("/user/verification/:token", emailController.checkToken);

// GENERAL USER TO VIEW ALL MOVIES
router.get("/user/allMovies", movieController.findAllMovies);

/*********Exports*************/
module.exports = router