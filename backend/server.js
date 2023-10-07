const express = require('express');
const app = express();
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
var routes = require('./routes/routes');

app.listen(3000, function (error) {
  if (error)
    console.log("Error");
  else
    console.log("Started");
});

mongoose.connect("mongodb://0.0.0.0:27017/Assignment", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("Successfully Connected to DB");
})
.catch((error) => {
  console.error("Error Connecting to DB:", error);
});
app.use(express.json());
app.use(routes);