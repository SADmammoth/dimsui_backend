import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import passport from 'passport';
import apiRouter from './routers/apiRouter';
import cookieParser from 'cookie-parser';
import authRouter from './routers/authRouter';

const port = process.env.PORT || 8080;
const app = express();

mongoose.connect(process.env.MONGODB_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '/public'));
app.use(express.json());

app.use(cors());
app.use('/api', apiRouter);
app.use('/auth', authRouter);

app.listen(port);
