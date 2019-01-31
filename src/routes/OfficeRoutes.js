import express from 'express';
import OfficeController from '../controllers/OfficeController';
import OfficeValidator from '../middlewares/OfficeValidator';

const officeRouter = express.Router();

officeRouter.post('/', OfficeValidator.createOfficeValidator, OfficeController.createOffice);

export default officeRouter;
