const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cron = require('node-cron');
const fs = require('fs');
const dotenv = require("dotenv");
dotenv.config();

mongoose
    .connect(
        process.env.DB_URL,
        { useNewUrlParser : true, }
    )
    .then(() => console.log('MongoDb is Connected')) 
    .catch((err) => console.log(err));

const CronSchema = new mongoose.Schema({
    count:{
        type: Number
    }, 
});
const Cron = mongoose.model('Cron', CronSchema); 

cron.schedule('*/30 * * * * *', () => {
    console.log("running a task every minute");
    Cron.updateMany( 
       {$inc: { count: 1}}, 
        function( result) {
            console.log(result);
        });
});

const deleteFileCron = cron.schedule("* * * * *", () => {
    console.log("running a task every minute");
    fs.unlink("./text.txt", err => {
      if (err) {
        console.log("Failed to delete file");
      } else {
        console.log("File has been deleted successfully");
      }
    });
  });
deleteFileCron.start()
  
cron.schedule('0 17 * * monday', () => {
    console.log('running a task every Monday at 5:00 pm');
});


app.listen(3000, () => console.log('Server is listening in 3000 port'));
