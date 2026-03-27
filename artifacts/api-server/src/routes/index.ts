import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import monitorsRouter from "./monitors";
import incidentsRouter from "./incidents";
import statusPagesRouter from "./status-pages";
import notificationsRouter from "./notifications";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(monitorsRouter);
router.use(incidentsRouter);
router.use(statusPagesRouter);
router.use(notificationsRouter);

export default router;
