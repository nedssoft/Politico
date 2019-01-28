import express from 'express';
import bodyParser from 'body-parser';
import debug from 'debug';
import morgan from 'morgan';

const app = express();
const debugg = debug('app');
const port = process.env.PORT || 5000;
app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', (req, res) => {
  res.send('welcome to Politico');
});

app.listen(port, () => {
  debugg(`App started at port ${port}`);
});
