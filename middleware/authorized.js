const expressJwt = require('express-jwt');
const User = require('../models/user');
const validationerror = require("./validationError");
// const Product = require('../models/product/product');


require('dotenv').config({ path: 'config.env' });

exports.requireSignin = expressJwt({
  secret: process.env.TOKEN_SECRET,
  algorithms: ['HS256'],
  userProperty: 'auth' }), (req, res,next) => {
    return next(new validationerror('Not Signed In', 401));
  };

exports.isAuth = (req, res, next) => {
  let user = req.profile && req.auth && req.profile.userId == req.auth.userId;
  // console.log(req.profile);
  if(!user) {
    return next(new validationerror('Access denied', 401));
  }
  next();
}

exports.isAuthForSubAdmin = async (req, res, next) => {
  const userDetails = await User.findOne({userId: req.params.userId});
  let user =  userDetails.userId == req.auth.userId;
  // console.log(req.profile);
  if(!user) {
    return next(new validationerror('Access denied', 401));
  }
  next();
}

exports.isAuthForAdmin = async (req, res, next) => {
  const userDetails = await User.findOne({email: req.body.adminEmail});
  let user =  userDetails.userId == req.auth.userId;
  // console.log(req.profile);
  if(!user) {
    return next(new validationerror('Access denied', 401));
  }
  next();
}

exports.restrictTo = (...roles) => {
  return async (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    const user = await User.findOne({userId: req.params.userId});
    console.log("from restrictTo");
    console.log(user);
    if (!roles.includes(user.userRole)) {
      
       return next(new validationerror('You do not have permission to perform this action', 403));
      
    }

    next();
  };
};

// exports.checkProductId =  (req,res ,next) => {
//   // var count =0;
//   var product;
//   var result = req.body.productId;
//   result.forEach( async function(e){
//     //    product = await Product.findOne({ productId: e });
//       //  console.log("from loop");
//       //  console.log(product.productId);
//        if(!product) {
//         return next(new validationerror("not a valid productId", 401));
//   }
// });
// next();
// }

exports.checkUser = (...roles) => {
  return async (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    try{
      const user = await User.findOne({email: req.body.email});
      // console.log("from checkUser");
      // console.log(user);
      // user ? user : return next(new validationerror("invalid email and password"));
      if (!roles.includes(user.userRole)) {
        
         return next(new validationerror('You do not have permission to perform this action', 403));
        
      }
  
      next();
    }

    catch(err) {
      return next(new validationerror('user not exisits', 403));
    }
   
  };
};

exports.adminChecking = (...roles) => {
  return async (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    const user = await User.findOne({email: req.body.adminEmail});
    // console.log("from checkUser");
    // console.log(user);
    // user ? user : return next(new validationerror("invalid email and password"));
    if (!roles.includes(user.userRole)) {
      
       return next(new validationerror('You do not have permission to perform this action', 403));
      
    }

    next();
  };
};
// allowing only verifeid users 
exports.userVerification = async (req,res,next) => {
    // roles ['admin', 'lead-guide']. role='user'

    // important: enable this for allowing verifeid users
    
    const user = await User.findOne({userId: req.params.userId});
    console.log("from user verification");
    console.log(user);
    
    if (!(user.verified)) {
      
       return next(new validationerror('You are not verified, please check your email for verification', 403));      
    }

    next();
  
};