import { RequestHandler, Request, Response  } from "express";

export const co = (f: Function): RequestHandler =>
    (req: Request, res: Response, next: Function): Promise<void> => f(req, res, next).catch(next);


export const timeStringToMilliseconds = (str: string): number => {
    const tripleType = /^(\d+):([0-5]?[0-9]):([0-5][0-9])$/.exec(str);
    if (tripleType) {
        const hours: number = Number(tripleType[1] || 0);
        const minutes: number = Number(tripleType[2] || 0);
        const seconds: number = Number(tripleType[3]);
        return (hours * 60 * 60 * 1000) + (minutes * 60 * 1000) + (seconds * 1000);
    }
    const doubleType = /^([0-5]?[0-9]):([0-5][0-9])$/.exec(str);
    if (doubleType) {
        const minutes: number = Number(doubleType[1] || 0);
        const seconds: number = Number(doubleType[2]);
        return (minutes * 60 * 1000) + (seconds * 1000);
    }
    return 0;
};