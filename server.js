const express = require('express');
require('dotenv').config()
const path = require('path')
const cors = require('cors')

const connectDB = require('./src/database');

const app = express();
app
.use(cors())
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

app.listen('3333', ()=>{console.log('server runnin at 3333 port yeeyy')})