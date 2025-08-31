import express from 'express';
import { ccavRequestHandler, ccavResponseHandler } from '../controllers/ccavenueController.js';

const ccavenueRouter = express.Router();

ccavenueRouter.post('/request', ccavRequestHandler);
ccavenueRouter.post('/response', ccavResponseHandler);

export default ccavenueRouter;
