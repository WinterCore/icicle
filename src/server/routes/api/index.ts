import { Router, Request, Response } from "express";
import { json }                      from "body-parser";
import * as cors                     from "cors";

import auth   from "./auth";
import search from "./search";
import queue  from "./queue";

import authenticated from "../middleware/authenticated";

const router: Router = Router();
router.use(cors());
router.use(json());

router.use("/auth", auth);
router.use("/search", search);
router.use("/queue", queue);

router.use((req: Request, res: Response, next: Function) => {
    res.status(404);
    res.json({ message : "Error : The route you're trying to reach doesn't exist" });
});

export default router;