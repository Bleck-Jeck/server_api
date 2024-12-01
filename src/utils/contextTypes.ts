import { Request, Response } from 'express';
import session from 'express-session';

export interface MyContext {
    req: Request & { session: session.Session };
    res: Response;
}
