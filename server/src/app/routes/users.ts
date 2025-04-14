import { Router } from 'express';
import validateModelFromPayloadHandler from '../middleware/validate-model-from-payload-handler';
import usersController from "../controllers/users";
import { User } from '../models/user';
import validateObjectIdFromRouteHandler from "../middleware/validate-object-id-from-route-handler";

const router = Router();

router.post('/login', usersController.login);
router.post('/signup', validateModelFromPayloadHandler(User), usersController.signUp);
router.patch('/:id', validateObjectIdFromRouteHandler(), usersController.updateUser);

export default router;
