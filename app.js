import express from 'express';
import bodyParser from 'body-parser';
import debug from 'debug';
import morgan from 'morgan';
import expressValidator from 'express-validator';
import partyRouter from './src/routes/PartyRoutes';

const app = express();
const debugg = debug('app');
const port = process.env.PORT || 5000;
app.use(expressValidator());
app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/api/v1/parties', partyRouter);
app.get('/', (req, res) => {
  res.send('welcome to Politico');
});

app.listen(port, () => {
  debugg(`App started at port ${port}`);
});
export default app;
