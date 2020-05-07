import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import apiRouter from './routers/apiRouter';

const port = process.env.PORT || 8080;
const app = express();

mongoose.connect(process.env.MONGODB_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

app.use(express.static(__dirname + '/public'));
app.use(express.json());

app.use(cors());
app.use('/api', apiRouter);

app.listen(port);
