import { Router, Request, Response } from "express";
import { json }                      from "body-parser";
import * as cors                     from "cors";

import auth    from "./auth";
import search  from "./search";
import people  from "./people";
import queue   from "./queue";

const router: Router = Router();
router.use(cors());
router.use(json());

router.use("/auth", auth);
router.use("/search", search);
router.use("/people", people);
router.use("/queue", queue);

router.use((req: Request, res: Response) => {
    res.status(404);
    res.json({ message : "Error : The route you're trying to reach doesn't exist" });
});

export default router;