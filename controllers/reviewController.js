const User = require("../models/user")
const Review = require("../models/review")
const validationerror = require("../middleware/validationError");

const { v4: uuidv4 } = require('uuid')
const moment = require("moment")

class ReviewAddController {

    async addReview(req, res,next){

        // console.log("from Review add controller");
        var userId = req.params.userId;

        if(userId == req.auth.userId){
            let user = await User.findOne({ userId: userId});
            if (user == null) {
                return next (new validationerror("Process Failed, User not found", 400));
            }
            
            let title = req.body.title;
            let reviewId = uuidv4();
            let movieId = req.params.movieId;
            let description = req.body.description;
            let rating = req.body.rating;

            let ReviewAdd = new Review({
              reviewId: reviewId,
              movieId: movieId,
              title: title,
              userId: user.userId,
              description: description,
              rating: rating,
              createdAt: moment(Date.now()).unix()
            })

            await ReviewAdd.save()
            return res.status(200).json({"message":"ok"})

        } else {
            return next(new validationerror("Process Failed, Unauthorized", 401));
        }

    };

    async editReviewDetails(req, res,next){

        var userId = req.params.userId;
        var movieId = req.params.movieId;

        if(userId == req.auth.userId){

            let reviewRes = await Review.findOne({ userId: userId, movieId: movieId});
            if (reviewRes == null) {
                res.status(400).json(new validationerror("Process Failed, reviewRes not found", 400));
            }

            var title = req.body.title || reviewRes.title;
            var description = req.body.description || reviewRes.description;
            var rating = req.body.rating || reviewRes.rating;

            reviewRes.title = title;
            reviewRes.description = description;
            reviewRes.rating = rating;
            reviewRes.updatedAt = moment(Date.now()).unix();
            await reviewRes.save();

            return res.status(200).json({"message":"ok"})

        } else {
           return next(new validationerror("Process Failed, Unauthorized", 401));
        }

    };
    async editReviewByAdmin(req, res,next){

        var userId = req.params.userId;
        var reviewId = req.params.reviewId;

        if(userId == req.auth.userId){

            let reviewRes = await Review.findOne({reviewId: reviewId});
            if (reviewRes == null) {
                res.status(400).json(new validationerror("Process Failed, reviewRes not found", 400));
            }

            var title = req.body.title || reviewRes.title;
            var description = req.body.description || reviewRes.description;
            var rating = req.body.rating || reviewRes.rating;

            reviewRes.title = title;
            reviewRes.description = description;
            reviewRes.rating = rating;
            reviewRes.updatedAt = moment(Date.now()).unix();
            await reviewRes.save();

            return res.status(200).json({"message":"ok"})

        } else {
           return next(new validationerror("Process Failed, Unauthorized", 401));
        }

    };

    async deleteReviewByAdmin(req,res,next){
        // let userId = req.params.userId;
        let reviewId = req.params.reviewId;
        // const delReview =  await foodData.findByIdAndDelete(req.params.id);
        const delReview =  await Review.deleteMany({reviewId: reviewId});
        if(!delReview)
        {
            return next(new validationerror('No food found with that ID', 404));
        }
         res.send("Done");

};

    async deleteReview(req,res,next){
        let userId = req.params.userId;
        let movieId = req.params.movieId;
        // const delReview =  await foodData.findByIdAndDelete(req.params.id);
        const delReview =  await Review.deleteOne({userId: userId, movieId: movieId});
        if(!delReview)
        {
            return next(new validationerror('No food found with that ID', 404));
        }
         res.send("Done");

};



}

const reviewAddController = new ReviewAddController()
module.exports = reviewAddController
