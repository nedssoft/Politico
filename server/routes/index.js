import express from 'express';
import OfficeController from '../controllers/OfficeController';
import OfficeValidator from '../middlewares/OfficeValidator';
import PartyController from '../controllers/PartyController';
import PartyValidator from '../middlewares/PartyValidator';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('welcome to Politico');
});

/* *
*
* Office Routes
*/
const officeUrl = '/api/v1/offices';

router.get(`${officeUrl}/:officeId`,
  OfficeValidator.readOfficeValidator,
  OfficeController.getOffice);
router.post(officeUrl, OfficeValidator.createOfficeValidator, OfficeController.createOffice);

router.get(officeUrl, OfficeController.all);

/**  End Office Routes */

/** Party Routes */
const partyUrl = '/api/v1/parties';
router.post(partyUrl, PartyValidator.createPartyValidator, PartyController.create);
router.get(partyUrl, PartyController.all);

router.patch(`${partyUrl}/:partyId`, PartyValidator.editPartyValidator, PartyController.edit);

router.get(`${partyUrl}/:partyId`, PartyController.getAParty);

router.delete(`${partyUrl}/:partyId`, PartyValidator.deletePartyValidator, PartyController.deleteParty);

/** End Party Routes */

export default router;
