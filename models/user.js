const mongoose = require("mongoose");
const crypto = require("crypto");
const {uuid} = require("uuidv4");
const moment = require("moment");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;
const Hashing = require("../utils/hashing");

const userSchema = new Schema(
  {

    userId: {
      type: String,
      // required:[true,'UserId is must!'],
      unique: true
    },
    username: {
      type: String,
      required: [true,'Username is must!'],
      unique: true
    },
    firstname: {
      type: String,
      required: [true,'A user must have a firstname!'],
    },
    lastname: {
      type: String
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true,'A user must provide email!'],
      unique: true
    },
    password: {
      type: String,
      required: [true,'please provide a password!'],
    //   select: false
    },
    verified: {
      type:Boolean,
      default: false
    },
    addressName: {
      type: String,
      default: "Not Updated"
    },
    // Street, Landmark, City, State, Country, Pin-code
    contactNumber: {
      type: String,
      required: [true,'please provide your contactnumber!'],
    },
    createdAt: {
      type: Number,
      // required: [true,'createdAt is must!'],
    },
    updatedAt: {
      type: Number,
      default: 0
    },
    userRole:{
      type:String,
      enum: ['user', 'admin'],
      required:[true,'A user must have a role'],
      default:"user"
    },
    verificationToken:{
      type:String
    },
    confirmEmailToken:{String},
    // verifySellerToken:{String},
    // passwordResetToken: String,
    passwordResetExpires: Date,
    passwordChangedAt: Date,
    // resetPasswordToken:String,
    token:String,
    confirmEmailHashedToken: String,
    // verifySellerHashedToken: String,
    // MostVisitedProduct:[{
    //   type:String,
    //   enum: ['Clothing','Toys','Sports','Beauty','Automobiles','Books','Media','Natural','Dairy','Food','Accessories']
    // }],
  },
   
  {
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
    }
);

//   userSchema.pre('save', async function (next) {
//     // Only run this function if password was actually modified
//     // this.userId = uuid();
//     // this.createdAt= moment(Date.now()).unix();
//     // this.updatedAt= moment(Date.now()).unix();

//     // // Hash the password with cost of 12
//     // let salt = await bcrypt.genSaltSync(10)
//     // let pass = await this.password
//     // this.password = await bcrypt.hashSync(pass, salt),
    

//     next();
// });

// userSchema.virtual('wishlist',{
//   ref:'wishlistModel',
//   foreignField:'customerId',
//   localField:'userId'
// });

// userSchema.virtual('cartlist',{
//   ref:'cartlistModel',
//   foreignField:'customerId',
//   localField:'userId'
// });


  

userSchema.methods.createEmailVerificationToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.confirmEmailHashedToken = Hashing.hash(resetToken, resetToken.length);
  console.log({ resetToken }, this.confirmEmailHashedToken);
  console.log("from email verification");
  // console.log({ verifyToken }, this.verificationToken);

  return resetToken;
};
// password reset token is Different from verification token
userSchema.methods.createPasswordResetToken =  function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.token = Hashing.hash(resetToken, resetToken.length);
  console.log({ resetToken }, this.token);
  // console.log(this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// userSchema.methods.createSellerVerificationToken =  function () {
//   const resetToken = crypto.randomBytes(32).toString('hex');
//   this.verifySellerHashedToken = Hashing.hash(resetToken, resetToken.length);
//   console.log({ resetToken }, this.verifySellerHashedToken);
//   // console.log(this.passwordResetToken);

//   // this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

//   return resetToken;
// };

// userSchema.virtual('wishListPage', {
//   ref: 'product',
//   foreignField: 'wishListUserId',
//   localField: 'userId'
// });

const User = mongoose.model("user", userSchema);
module.exports = User;
