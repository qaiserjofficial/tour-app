const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv'); //use to read environment variables
const Tour = require('../../models/tourModel');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');

dotenv.config({ path: './config.env' }); //path of configuration file

const DB = process.env.DATABASE.replace(
  // Replacing password with DATABASE_PASSWORD in connection string
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

/***************************Mongoose***********************************/
//Connecting mongoose to MongoDB database
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection established!'));

//Read JSON File
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
// const reviews = JSON.parse(
//   fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
// );

//IMPORT DATA From JSON FILE INTO DB
const importData = async () => {
  try {
    // await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log('Data successfully added to database');
  } catch (err) {
    console.log(err);
  }
  process.exit(); // to stop processing after creation
};

//DELETE DATA From Collection
const deleteData = async () => {
  try {
    // await Tour.deleteMany();
    // await User.deleteMany();
    await Review.deleteMany();
    console.log('Previous Data successfully deleted from collection');
  } catch (err) {
    console.log(err);
  }
  process.exit(); // to stop processing after deletion
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
console.log(process.argv); // show where node command is currently located
