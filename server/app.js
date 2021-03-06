//dependencies
const express = require('express');
const dotev = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

//internal imports
const { notFoundHandler, defaultErrorHandler } = require('./middlewares/common/errorHandlers');
const userRouter = require('./routers/userRouter');
const imageRouter = require('./routers/imageRouter');

//intitialise the app
const app = express();

//initialise dot env
dotev.config();
app.use(cookieParser());

//*default middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//set static folder
if (process.env.NODE_ENV === 'production') {
   app.use(express.static('client/build'));
} else {
   app.use(express.static(path.join(__dirname, 'public')));
}

//setup cors
const corsOptions = {
   origin: true,
   methods: 'GET,HEAD,OPTIONS,PATCH,POST,DELETE',
   credentials: true,
   //exposedHeaders: ['set-cookie'],
};
app.use(cors(corsOptions));

//database connection
mongoose
   .connect(process.env.MONGOOSE_CONNECTION_STRING)
   .then(() => console.log(`App is sucessfully connected to database`))
   .catch((error) => console.log(error));

//routes
app.use('/api/user', userRouter);
app.use('/api/image', imageRouter);
//app.use('/api/category', categoryHandler); //TODO: neeed to create category handler

//404 not found handler
app.all('*', notFoundHandler);

//default error handler
app.use(defaultErrorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`App is alive on localhost:${PORT}`));
