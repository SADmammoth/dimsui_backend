import express from 'express';
import databaseInit from '../controllers/databaseInit';
import membersRouter from './membersRouter';
import tasksRouter from './tasksRouter';
import tracksRouter from './tracksRouter';
import progressRouter from './progressRouter';

var apiRouter = express.Router();

apiRouter.get('/directions', databaseInit.getDirections);
apiRouter.post('/directions', databaseInit.createDirections);
apiRouter.post('/states', databaseInit.createTaskStates);

apiRouter.use(membersRouter);
apiRouter.use(tasksRouter);
apiRouter.use(tracksRouter);
apiRouter.use(progressRouter);

export default apiRouter;
