const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');

dotenv.config();

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
const dbConn = mongoose.connection;

dbConn.on("error", () => console.log("An error occured."));
dbConn.on("connected", () => console.log("Database connected."));

app.use(express.json());
app.use(helmet());
app.use(morgan('common'));

app.listen(3000, () => {
  console.log('Served started at port 3000')
});