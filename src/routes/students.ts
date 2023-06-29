import { Router } from 'express';
import { StudentControllers } from '../controllers/students';

export const studentRouter = Router();

studentRouter.get('/:id', StudentControllers.getOne);
studentRouter.get('/', StudentControllers.getAll);
studentRouter.put('/update/:id', StudentControllers.update);
studentRouter.delete('/delete/:id', StudentControllers.delete);
