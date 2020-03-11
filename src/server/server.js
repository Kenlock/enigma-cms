import express from 'express';
import passport from 'passport';
import { User, SiteConfig, Document, DocumentType, SiteTheme } from './models';
import { default as SignupStrategy } from './passport/signup';
import { default as LoginStrategy } from './passport/login';
import mongoose from 'mongoose';
import {
  userRoutes, configRoutes, documentRoutes, fileRoutes, searchRoutes,
  sitemapRoutes, themeRoutes
} from './routes/api';
import bodyParser from 'body-parser';
import { default as expressSession } from './session';
import { default as ssrRoutes } from './routes/ssr';
import { default as ampRoutes } from './routes/ssr/amp';
import { createProxyServer } from 'http-proxy';
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

  SiteTheme.findOne({}).then(theme => {
    if (!theme) {
      let newTheme = new SiteTheme({});
      newTheme.save();
    }
    else return;
  });

  User.find().then(users => {
    users.forEach(u => { u.save(); });
  });

  Document.find({}).then(docs => {
    docs.forEach(doc => { doc.save(); });
  });
});

app.post('/api', function(req, res) {
  apiProxy.web(req, res, { target: `http://localhost:${port}/api` })
});

app.use(expressSession);

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(({ _id }, done) => {
  done(null, _id);
});
passport.deserializeUser((_id, done) => {
  User.findById(_id, function(err, user) {
    done(err, user);
  });
});

passport.use('local-signup', SignupStrategy);
passport.use('local-login', LoginStrategy);

app.use(express.static(path.join(__dirname, '/public')));
app.use('/api/users', userRoutes);
app.use('/api/site_config', configRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/sitemap', sitemapRoutes);
app.use('/api/site_theme', themeRoutes);

app.get('/sitemap.txt', async ({ headers: { host }, protocol }, res) => {
  var docTypes = await DocumentType.find({}).select({ docTypeNamePlural: 1,
      docTypeId: 1 }), documents = await Document.find({ draft: false }).sort({
      docType: 1, createdAt: -1 }).select({ slug: 1, docTypeId: 1, _id: -1 }),
    docTypeMap = {}, slugs = [`${protocol}://${host}/`, `${protocol}://${host}/?amp=true`];
  docTypes.forEach(({ docTypeNamePlural, docTypeId }) => {
    slugs.push(`${protocol}://${host}/${docTypeNamePlural}`,
      `${protocol}://${host}/${docTypeNamePlural}?amp=true`);
    docTypeMap[docTypeId] = docTypeNamePlural; });
  slugs.push(...documents.map(({ docTypeId, slug }) =>
    `${protocol}://${host}/${docTypeMap[docTypeId]}/${slug}`));
  slugs.push(...documents.map(({ docTypeId, slug }) =>
    `${protocol}://${host}/${docTypeMap[docTypeId]}/${slug}?amp=true`));
  slugs.sort();
  res.header('Content-Type', 'text/plain');
  res.send(slugs.join('\n'));
});

app.get('/style.css', (req, res) => {
  SiteConfig.findOne({ }).then(({ stylesheet }) => {
    res.header('Content-Type', 'text/css');
    res.send(`${stylesheet}\n`);
  });
});
app.use('/', express.static(path.join(__dirname, '/public')));
app.get('/*', function(req, res, next) {
  if (req.query.amp) return ampRoutes(req, res, next);
  return ssrRoutes(req, res, next);
});

app.listen(port);
