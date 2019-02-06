import express from 'express';

import PartyController from '../controllers/PartyController';
import PartyValidator from '../middlewares/PartyValidator';
import AuthValidator from '../middlewares/AuthValidator';
import UserController from '../controllers/UserController';


const router = express.Router();
const { createAccount, loginUser } = UserController;
const { validateSignUp, userExists, validateLogin, isAdmin } = AuthValidator;

const { createPartyValidator, validateParam, isDuplicate,
  partyExists, editPartyValidator } = PartyValidator;
const { createParty, getAParty, allParties, deleteParty, editParty } = PartyController;
router.get('/', (req, res) => {
  res.send('welcome to Politico');
});


/** Party Routes */
const partyUrl = '/api/v1/parties';
router.post(partyUrl, createPartyValidator, isDuplicate, isAdmin, createParty);
router.get(`${partyUrl}/:partyId`, validateParam, getAParty);
router.delete(`${partyUrl}/:partyId`, validateParam, isAdmin, partyExists, deleteParty);
router.patch(`${partyUrl}/:partyId`, validateParam, isAdmin, partyExists,
  editPartyValidator, editParty);
router.get(partyUrl, allParties);


/** End Party Routes */

const authBaseUrl = '/api/v1/auth';
router.post(`${authBaseUrl}/signup`, validateSignUp, userExists, createAccount);
router.post(`${authBaseUrl}/login`, validateLogin, loginUser);
export default router;
