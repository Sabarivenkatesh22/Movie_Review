const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({

    movieId:{
        type: String,
    },
    userId:{
        type: String,
    },
    title:{
        type: String,
        required: [true, "A Movie title is required!"],
    },
    description:{
        type: String,
    },
    cast:{ 
        type: String,
    },
    createdAt:{
        type: Number,
    }
},
{
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

movieSchema.virtual("reviews", {
    ref: "review",
    foreignField: "movieId",
    localField: "movieId",
  });

const movieModel = mongoose.model("movie",movieSchema);


module.exports = movieModel;