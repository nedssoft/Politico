import express from 'express';
import PartyController from '../controllers/PartyController';
import PartyValidator from '../middlewares/PartyValidator';

const partyRouter = express.Router();

partyRouter.post('/', PartyValidator.createPartyValidator, PartyController.create);
partyRouter.get('/:partyId', PartyController.getAParty);

export default partyRouter;
