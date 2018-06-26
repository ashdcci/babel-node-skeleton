import _ from './config/env'
import http from 'http';
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import 'express-group-routes';
const port = process.env.BNP_PORT;
const app = express();
const server = http.createServer(app);
import routesFactory from './routes/index';

// Body Parser MW
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(cors())
//View Engine
app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);


//morge dev mode set
app.use(morgan('dev'));

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

const routes = routesFactory(app);

server.listen(port, function(){
  if(process.env.BNP_ENV=='dev'){
    console.log('Server started on port '+port);
  }
});


export default { app,process };