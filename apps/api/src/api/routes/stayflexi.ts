
import StayFlexiService from '@app/services/StayFlexiService';
import { Request, Response, Router } from 'express';

const route = Router()

export default (app: Router) => {
    app.use('/stayflexi', route);
    route.post(
        '/send-message',
        async (req: Request, res: Response) => {
            const response = await StayFlexiService.sendMessage(req.body);
            return res.send(response);
    });
}