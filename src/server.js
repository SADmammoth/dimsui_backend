const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const apiRouter = require('./routers/apiRouter');
const cookieParser = require('cookie-parser');
const authRouter = require('./routers/authRouter');

const port = process.env.PORT || 8080;
const app = express();

mongoose.connect(process.env.MONGODB_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

mongoose.set('useCreateIndex', true);

app.use(cookieParser());
app.use(passport.initialize());

app.use(express.static(__dirname + '/public'));
app.use(express.json());

app.use(cors());
app.use('/api', passport.authenticate('jwt', { session: false }), apiRouter);
app.use('/auth', authRouter);

app.listen(port);
