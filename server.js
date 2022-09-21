const express = require('express');
require('dotenv').config()
const path = require('path')
const cors = require('cors')

const connectDB = require('./src/database');

const port = process.env.PORT || 3333;

const app = express();

app
.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://qgda30.herokuapp.com/")
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested, Content-Type, Accept Authorization"
    )
    if (req.method === "OPTIONS") {
      res.header(
        "Access-Control-Allow-Methods",
        "POST, PUT, PATCH, GET, DELETE"
      )
      return res.status(200).json({})
    }
    next()
  })
// .use(cors())
.use(express.json({limit: '50mb'}))
.use(express.urlencoded({ extended: true, limit : '50mb' }))

const appRouteFiles = [
    '/app/studio',
    '/app/login',
    '/app/storage',
    '/'
]

//app.use('/app/studio', express.static(path.join(__dirname, 'dist')));
app.use(appRouteFiles, express.static(path.join(__dirname, 'dist')));
//app.use('/app/login', express.static(path.join(__dirname, 'dist')));
//app.use('/app/storage', express.static(path.join(__dirname, 'dist')));
app.use('/images', express.static(path.join(__dirname, 'tmp', "images")));
app.use('/ad', express.static(path.join(__dirname, 'tmp', "ad")));
app.set('views', path.join(__dirname, 'dist'));
app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');
app.set('view engine', 'html');

connectDB();

app.use('/', require('./src/publicRoutes'))
app.use('/app', require('./src/privateRoutes'))

app.listen(port, ()=>{console.log(`server runnin at ${port} port yeeyy`)})