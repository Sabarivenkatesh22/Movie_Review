const User = require("../models/user")
const Movie = require("../models/movie")
const validationerror = require("../middleware/validationError");

const { v4: uuidv4 } = require('uuid')
const moment = require("moment")

class MovieAddController {

    async addMovie(req, res, next) {

        // console.log("from Movie add controller");
        var userId = req.params.userId;

        if (userId == req.auth.userId) {
            let user = await User.findOne({ userId: userId });
            if (user == null) {
                return next(new validationerror("Process Failed, User not found", 400));
            }

            let title = req.body.title;
            let movieId = uuidv4();
            let description = req.body.description;
            let cast = req.body.cast;

            let MovieAdd = new Movie({
                movieId: movieId,
                title: title,
                userId: user.userId,
                description: description,
                cast : cast,
                createdAt: moment(Date.now()).unix()
            })

            await MovieAdd.save()
            return res.status(200).json({ "message": "ok" })

        } else {
            return next(new validationerror("Process Failed, Unauthorized", 401));
        }

    };

    async editMovieDetails(req, res,next){

        var userId = req.params.userId;
        var movieIdToEdit = req.params.movieId
        if(userId == req.auth.userId){

            let movieRes = await Movie.findOne({ movieId: movieIdToEdit});
            if (movieRes == null) {
                res.status(400).json(new validationerror("Process Failed, movieRes not found", 400));
            }

            var title = req.body.title || movieRes.title;
            var description = req.body.description || movieRes.description;
            var cast = req.body.cast || movieRes.cast;

            movieRes.title = title;
            movieRes.description = description;
            movieRes.cast = cast;
            movieRes.updatedAt = moment(Date.now()).unix();
            await movieRes.save();

            return res.status(200).json({"message":"ok"})

        } else {
           return next(new validationerror("Process Failed, Unauthorized", 401));
        }

    };


    async findMovie(req, res, next) {

        try {
            const movieRes = await Movie.findOne({ movieId: req.params.movieId }).populate({
                path: "reviews",
                select: 'title description rating userId'
            });
            res.status(200).json({

                
                    movieRes
                
                // reviews:[
                //     Review
                // ]
            });

        } catch (error) {
            return next(new validationerror(error.message, 400));
        }
    };

    async findAllMovies(req, res, next) {

        try {
            const movieRes = await Movie.find().populate({
                path: "reviews",
                select: 'title description rating userId reviewId'
            });
            res.status(200).json({
                results:movieRes.length,
                
                    movieRes
                
                // reviews:[
                //     Review
                // ]
            });

        } catch (error) {
            return next(new validationerror(error.message, 400));
        }
    };

    async deleteMovie(req,res,next){
        // let userId = req.params.userId;
        let movieId = req.params.movieId;
        // const delMovie =  await foodData.findByIdAndDelete(req.params.id);
        const delMovie =  await Movie.deleteOne({movieId: movieId});
        if(!delMovie)
        {
            return next(new validationerror('No food found with that ID', 404));
        }
         res.send("Done");

};




}

const movieAddController = new MovieAddController()
module.exports = movieAddController
