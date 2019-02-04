import express from 'express';
import OfficeController from '../controllers/dummyControllers/OfficeController';
import OfficeValidator from '../middlewares/OfficeValidator';
import PartyController from '../controllers/dummyControllers/PartyController';
import PartyValidator from '../middlewares/PartyValidator';
import AuthValidator from '../middlewares/AuthValidator';
import UserController from '../controllers/UserController';


const router = express.Router();
const { createAccount, loginUser } = UserController;
const { validateSignUp, userExists, validateLogin } = AuthValidator;
const { createOfficeValidator, readOfficeValidator } = OfficeValidator;
const { getOffice, allOffices, createOffice } = OfficeController;
const { editPartyValidator, createPartyValidator, deletePartyValidator } = PartyValidator;
const { allParties, createParty, editParty, getAParty, deleteParty } = PartyController;
router.get('/', (req, res) => {
  res.send('welcome to Politico');
});

/* *
*
* Office Routes
*/
const officeUrl = '/api/v1/offices';

router.get(`${officeUrl}/:officeId`, readOfficeValidator, getOffice);
router.post(officeUrl, createOfficeValidator, createOffice);

router.get(officeUrl, allOffices);

/**  End Office Routes */

/** Party Routes */
const partyUrl = '/api/v1/parties';
router.post(partyUrl, createPartyValidator, createParty);
router.get(partyUrl, allParties);

router.patch(`${partyUrl}/:partyId`, editPartyValidator, editParty);

router.get(`${partyUrl}/:partyId`, getAParty);

router.delete(`${partyUrl}/:partyId`, deletePartyValidator, deleteParty);

/** End Party Routes */

const authBaseUrl = '/api/v1/auth';
router.post(`${authBaseUrl}/signup`, validateSignUp, userExists, createAccount);
router.post(`${authBaseUrl}/login`, validateLogin, loginUser);
export default router;
