//dependencies for each module used
var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars');
var app = express();

var index = require('./routes/index');
var group = require('./routes/group');

//database setup
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URL || 'mongodb://localhost/grouploops');

app.locals.mongoose = mongoose;

//Configures the Template engine
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.bodyParser());

//routes
app.get('/', index.welcome);
app.get('/professor', index.professorView);
app.get('/student', index.studentView);
app.get('/groupview', group.view);
app.get('/checkCourseId', index.checkCourseId);

app.post('/createCourse', index.createCourse);

//set environment ports and start application
app.set('port', process.env.PORT || 3000);
http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
