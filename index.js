const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

dotenv.config();

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
const dbConn = mongoose.connection;

dbConn.on("error", () => console.log("An error occured."));
dbConn.on("connected", () => console.log("Database connected."));

// middlewares
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(helmet());
app.use(morgan('common'));

// routes
app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/posts', postRoute);

app.listen(5000, () => {
  console.log('Served started at port 3000')
});