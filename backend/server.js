const express = require('express');
const app = express();
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
var routes = require('./routes/routes');
var cors = require('cors');

app.use(cors(
    {
        origin: 'http://localhost:4200'
    }
) )

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
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
