// import { Router, Request, Response } from "express";

// import User from "../../database/models/user";

// import validateLoved from "../middleware/validation/loved";

// import { co, timeStringToMilliseconds } from "../helpers";

// const router: Router = Router();

// router.get("/", co(async (req: Request, res: Response) => {
//     const { loved }: Database.User = await User.findOne({ _id : req.userId }, { loved : 1 });

//     res.json({ data : loved });
// }));

// router.post("/", validateLoved, co(async (req: Request, res: Response) => {
//     const data = {
//         title : req.body.title,
//         videoId : req.body.videoId,
//         thumbnail : req.body.thumbnail,
//         duration : timeStringToMilliseconds(req.body.duration)
//     };
//     await User.updateOne({ _id : req.userId }, { $push : { loved : { $each : [data], $position : 0 } } });

//     res.json({ message : `${req.body.title} has been added successfully to your loved list` });
// }));

// router.delete("/", co(async (req: Request, res: Response) => {
//     await User.updateOne({ _id : req.userId }, { $pull : { loved : { videoId : req.body.videoId } } });

//     res.json({ message : `${req.body.title} has been added successfully to your loved list` });
// }));

// export default router;