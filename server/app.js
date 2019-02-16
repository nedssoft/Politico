import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import debug from 'debug';
import morgan from 'morgan';
import expressValidator from 'express-validator';
import router from './routes';
import multerUploads from './config/multer';

const app = express();
const debugg = debug('app');
const port = process.env.PORT || 3000;
app.use(cors());
app.use(expressValidator());
app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multerUploads);
app.use(router);

app.listen(port, () => {
  debugg(`App started at port ${port}`);
});

export default app;
