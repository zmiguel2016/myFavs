if (process.env.NODE_ENV !== 'production'){
    require('dotenv/config')
}
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const methodOverride = require('method-override')



app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({limit: '10mb', extended:false}))


//import routes

//home
const indexRouter = require('./routes/index')
app.use('/', indexRouter);

//artists
const artistRouter = require('./routes/artists')
app.use('/artists', artistRouter)

//songs
const songRouter = require('./routes/songs')
app.use('/songs', songRouter)



//connect to database
mongoose.connect(process.env.DB_CONNECTION,
{ useNewUrlParser: true, useUnifiedTopology: true }, 
 () => console.log("Connect to db") )

//listen
app.listen(process.env.PORT || 3000)

//app.listen(3000);