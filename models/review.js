const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    movieId: {
      type: String,
    },
    userId: {
      type: String,
    },
    reviewId:{
      type: String,
    },
    title: {
      type: String,
      required: [true, "A review title is required!"],
    },
    description: {
      type: String,
      // required: [true, "A description should be provided!"],
    },
    rating: {
      type: Number,
    },
    createdAt: {
        type: Number,
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);



reviewSchema.pre('find', function (next) {
  console.log("from pre middleware");
  this.populate({
      path:'userDetails',
      select:'username firstname '
  });
  
 

  next();
});

reviewSchema.post("findOne", function (doc) {
  console.log("doc is ", doc);
});

reviewSchema.virtual("userDetails", {
  ref: "user",
  foreignField: "userId",
  localField: "userId",
});

const reviewModel = mongoose.model("review", reviewSchema);

module.exports = reviewModel;
