
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import debug from 'debug';
import morgan from 'morgan';
import expressValidator from 'express-validator';
import router from './routes';

const app = express();
const debugg = debug('app');
const port = process.env.PORT || 3000;
app.use(cors());
app.options('*', cors());
app.use(expressValidator());
app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router);

app.listen(port, () => {
  debugg(`App started at port ${port}`);
});

export default app;
