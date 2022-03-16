const User = require("../models/user");
const validationerror = require("../middleware/validationError");
const Email = require("../utils/email");
const Hashing = require("../utils/hashing");


class EmailController
{
    async sendVerifyToken(req,res,next) {
        try {
          console.log("from sendVerifyToken");
          const user = await User.findOne({ email: req.body.email });
          // const token = user.createEmailVerificationToken();
          const token  = user.createEmailVerificationToken();
          console.log(token);
          await user.save();
          const checkURL = `${req.protocol}://${req.get(
            "host"
          )}/api/user/verification/${token}`;
    
          // send email to user
          new Email(user, checkURL).sendWelcome();
    
          console.log(checkURL);
          // res.send("Done");
        } catch (error) {
          return next(new validationerror(error.message,400));
        }
      }
    
      //  checking of token to verify the user
      async checkToken(req, res) {
    
        console.log("from checkToken");
        var token = req.params.token.trim();
        const hashedToken = Hashing.hash(token,((token.length)));
        console.log(hashedToken);
        const user = await User.findOne({
            confirmEmailHashedToken: hashedToken,
          // passwordResetExpires: { $gt: Date.now()
        //  }
        });
      
        // let user = await User.findOne({
        //   passwordResetToken: hashedToken,
        // });
        if (!user) {
          return next(new validationerror("Token is invalid or has expired", 400));
        } else {
          // making first verification true for every user after checking the token
          (user.verified = "true"),
           await user.save();
          res.send("User verified");
        }
      };
    
      // important: send only new email in req
       
}

const emailController = new EmailController();
module.exports = emailController;
