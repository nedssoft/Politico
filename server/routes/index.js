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

const { validateSignUp, userExists, validateLogin, isAdmin, checkToken,
  validatePhone } = AuthValidator;

const { isDuplicateOffice, validateOffice } = OfficeValidator;

const { createOffice, getAllOffices, findOffice } = OfficeController;

const { partyValidator, validateParam, isDuplicate,
  partyExists } = PartyValidator;

const { createParty, getAParty, allParties, deleteParty, editParty } = PartyController;

const { registerCandidate, vote, getElectionResult, getAllCandidates } = AdminController;

const { validateCandidate, checkIfOfficeExists, checkIfUserExists,
  checkIfUserHasVoted, checkIfCandidateExists,
  validateVote, validateOfficeId } = AdminValidator;

router.get('/', (req, res) => {
  res.send('welcome to Politico');
});


/** Party Routes */
const partyUrl = '/api/v1/parties';
router.post(partyUrl, partyValidator, isDuplicate, isAdmin, createParty);
router.get(`${partyUrl}/:partyId`, validateParam, getAParty);
router.delete(`${partyUrl}/:partyId`, partyValidator, isAdmin, partyExists, deleteParty);
router.patch(`${partyUrl}/:partyId`, partyValidator, isAdmin, partyExists, editParty);
router.get(partyUrl, allParties);

/** End Party Routes */

/** Office Routes */
const officeUrl = '/api/v1/offices';
router.post(officeUrl, validateOffice,
  isDuplicateOffice, isAdmin, createOffice);
router.get(officeUrl, getAllOffices);
router.get(`${officeUrl}/:officeId`, validateOffice, findOffice);

/** End office Routes */

/** Auth Routes */
const authBaseUrl = '/api/v1/auth';
router.post(`${authBaseUrl}/signup`, validateSignUp, userExists, validatePhone, createAccount);
router.post(`${authBaseUrl}/login`, validateLogin, loginUser);

/** End Auth Routes */
router.post('/api/v1/office/:userId/register', validateCandidate, checkIfOfficeExists,
  checkIfUserExists, isAdmin, registerCandidate);
/** Admin Routes */

/** Voting Routes */
router.post('/api/v1/vote', checkToken, validateVote, checkIfCandidateExists,
  checkIfOfficeExists, checkIfUserHasVoted, vote);

router.get('/api/v1/office/:officeId/result', validateOfficeId,
  checkIfOfficeExists, getElectionResult);

router.get('/api/v1/candidates', getAllCandidates);
/** End voting Routes */

export default router;
