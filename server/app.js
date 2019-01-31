import express from 'express';
import bodyParser from 'body-parser';
import debug from 'debug';
import morgan from 'morgan';
import expressValidator from 'express-validator';
import partyRouter from './routes/PartyRoutes';
import officeRouter from './routes/OfficeRoutes';

const app = express();
const debugg = debug('app');
const port = process.env.PORT || 7000;
app.use(expressValidator());
app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.send('welcome to Politico');
});

app.use('/api/v1/parties', partyRouter);
app.use('/api/v1/offices', officeRouter);


app.listen(port, () => {
  debugg(`App started at port ${port}`);
});

export default app;
