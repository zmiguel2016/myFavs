if (process.env.NODE_ENV !== 'production'){
    require('dotenv/config')
}
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose');
//require('dotenv/config')



app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))


//import routes
const indexRouter = require('./routes/index')
app.use('/', indexRouter);



//routes
/*
app.get('/', (req,res) => {
    res.send("We are on home");
});
*/

//connect to database
mongoose.connect(process.env.DB_CONNECTION,
{ useNewUrlParser: true, useUnifiedTopology: true }, 
 () => console.log("Connect to db") )

//listen
app.listen(process.env.PORT || 3000)

//app.listen(3000);