import express from 'express';

import PartyController from '../controllers/PartyController';
import PartyValidator from '../middlewares/PartyValidator';
import AuthValidator from '../middlewares/AuthValidator';
import UserController from '../controllers/UserController';
import OfficeValidator from '../middlewares/OfficeValiadator';
import OfficeController from '../controllers/OfficeController';
import AdminController from '../controllers/AdminController';
import AdminValidator from '../middlewares/AdminValidator';

const router = express.Router();

const { createAccount, loginUser } = UserController;

const { validateSignUp, userExists, validateLogin, isAdmin } = AuthValidator;

const { createOfficeValidator, isDuplicateOffice, validateOfficeParam } = OfficeValidator;

const { createOffice, getAllOffices, findOffice } = OfficeController;

const { createPartyValidator, validateParam, isDuplicate,
  partyExists, editPartyValidator } = PartyValidator;

const { createParty, getAParty, allParties, deleteParty, editParty } = PartyController;

const { registerCandidate } = AdminController;

const { validateCandidate, checkIfOfficeExists, checkIfUserExists,
  validateUserId } = AdminValidator;

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

/** Office Routes */
const officeUrl = '/api/v1/offices';
router.post(officeUrl, createOfficeValidator,
  isDuplicateOffice, isAdmin, createOffice);
router.get(officeUrl, getAllOffices);
router.get(`${officeUrl}/:officeId`, validateOfficeParam, findOffice);

/** End office Routes */

/** Auth Routes */
const authBaseUrl = '/api/v1/auth';
router.post(`${authBaseUrl}/signup`, validateSignUp, userExists, createAccount);
router.post(`${authBaseUrl}/login`, validateLogin, loginUser);

/** End Auth Routes */
router.post('/api/v1/office/:userId/register', validateCandidate, checkIfOfficeExists,
  validateUserId, checkIfUserExists, isAdmin, registerCandidate);

/** Admin Routes */

export default router;
