import express from 'express';
import passport from 'passport';
import User from './models/User';
import SiteConfig from './models/SiteConfig';
import { default as SignupStrategy } from './passport/signup';
import { default as LoginStrategy } from './passport/login';
import mongoose from 'mongoose';
import { default as userRoutes } from './routes/api/users';
import { default as configRoutes } from './routes/api/site_config';
import { default as documentRoutes } from './routes/api/documents';
import { default as fileRoutes } from './routes/api/file_mgmt';
import bodyParser from 'body-parser';
import { default as expressSession } from './session';
import { default as ssrRoutes } from './routes/ssr';
import { createProxyServer } from 'http-proxy';
import fs from 'fs';
import path from 'path';

mongoose.Promise = global.Promise;

var app = express(), port = process.env.SERVER_PORT || 8080,
  apiProxy = createProxyServer();

mongoose.connect(require('../../config/db.js').url, {}, () => {
  SiteConfig.findOne({}).then(config => {
    if (!config) {
      let newConfig = new SiteConfig({});
      newConfig.save();
    }
    else return;
  });
});

app.post('/api', function(req, res) {
  apiProxy.web(req, res, { target: 'http://localhost:8080/api' })
});

app.use(expressSession);

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json({ limit: '50mb' }));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user._id);
});
passport.deserializeUser((_id, done) => {
  User.findById(_id, function(err, user) {
    done(err, user);
  });
});

passport.use('local-signup', SignupStrategy);

passport.use('local-login', LoginStrategy);

app.use(express.static('public'));
app.use('/api/users', userRoutes);
app.use('/api/site_config', configRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/files', fileRoutes);
app.get('/app.bundle.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8' );
  res.send(fs.readFileSync(path.resolve(__dirname, 'public/app.bundle.js')))
});
app.get('/prism.css', (req, res) => {
  res.send(fs.readFileSync(path.resolve(__dirname, 'public/prism.css')))
});
app.get('/favicon.ico', (req, res) => {
  res.send(fs.readFileSync(path.resolve(__dirname, 'public/favicon.ico')))
});
app.get('/*', ssrRoutes);

app.listen(port);
