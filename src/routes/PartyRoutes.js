import express from 'express';
import PartyController from '../controllers/PartyController';
import Validator from '../middlewares/Validator';

const partyRouter = express.Router();

partyRouter.post('/', Validator.validateParty, PartyController.create);

export default partyRouter;
