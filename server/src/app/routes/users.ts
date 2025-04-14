import { Router } from 'express';
import usersController from "../controllers/users";
import { User } from '../models/user';
import validateModelFromPayloadHandler from '../middleware/validate-model-from-payload-handler';
import validateObjectIdFromRouteHandler from "../middleware/validate-object-id-from-route-handler";
import validateRequiredKeysFromPayload from "../middleware/validate-required-keys-from-payload";

const router = Router();

router.post('/login', validateRequiredKeysFromPayload(['username', 'password']), usersController.login);
router.post('/signup', validateModelFromPayloadHandler(User), usersController.signUp);
router.patch('/:id', validateObjectIdFromRouteHandler(), usersController.updateUser);

export default router;
