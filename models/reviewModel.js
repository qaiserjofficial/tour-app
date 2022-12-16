const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: 'string',
      required: [true, 'Review can not be empty'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    //Reference created
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });
//QUERY MIDDLEWARE
reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'tour',
  //   select: 'name', //Skip these values during query
  // }).populate({
  //   path: 'user',
  //   select: 'name photo', //Skip these values during query
  // });

  this.populate({
    path: 'user',
    select: 'name photo', //Skip these values during query
  });
  next();
});

//Static Method : Calculating Average Ratings on Tours
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRatings: { $sum: 1 },
        avgRatings: { $avg: '$rating' },
      },
    },
  ]);
  if (stats.length > 0) {
    //Save the statistics to the current Tour
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: stats[0].avgRatings,
      ratingsQuantity: stats[0].nRatings,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: 0,
      ratingsQuantity: 4.5,
    });
  }
};
// Call after a new review is created
reviewSchema.post('save', function (next) {
  // this point to current review
  this.constructor.calcAverageRatings(this.tour);
});

//METHOD 1:
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  // console.log(this.r);
  next();
});

reviewSchema.post(/^findOneAnd/, async function (next) {
  // this.r = await this.findOne(); work not here because query has already executed
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

// METHOD 2:
// reviewSchema.post(/^findOneAnd/, (doc) => {
//   // console.log(doc);
//   // doc happens to be NULL when calling methods with wrong IDs
//   if (doc) doc.constructor.calcAverageRatings(doc.tourRef);
// });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
