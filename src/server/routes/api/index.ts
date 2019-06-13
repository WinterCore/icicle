import { Router, Request, Response } from "express";

import auth  from "./auth";
import loved from "./loved";

import authenticated from "../middleware/authenticated";

const router: Router = Router();

router.use("/auth", auth);
router.use("/loved", authenticated, loved);

router.use((req: Request, res: Response, next: Function) => {
    res.status(404);
    res.json({ message : "Error : The route you're trying to reach doesn't exist" });
});

export default router;