const express = require('express');
var cookieParser = require('cookie-parser')
// const userRouter = require('./routes/userRoutes')
// const bookRouter = require('./routes/bookRoutes')
const api = require('./api')
const app = express();


// DATA PARSING
app.use(cookieParser());
app.use((req,res,next)=>{
    console.log(req.body);
    next();
});


app.use(express.json());
app.use((req, res,next) => {
    console.log(req.headers);
    next();
})


/************APIs*******************/
app.use('/api', api)

// ERROR DETECTOR
app.use((err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    console.log(err.message);
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
});

module.exports = app;