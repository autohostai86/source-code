import AutomatedResponseService from '@app/services/AutomatedResponseService';
import { Request, Response, Router } from 'express';

const route = Router()

export default (app: Router) => {
    app.use('/automated-response', route);
    route.post(
        '/create',
        async (req: Request, res: Response) => {
            const response = await AutomatedResponseService.update(req.body);
            return res.send(response);
        })

    route.get(
        '/get-response',
        async (req: Request, res: Response) => {
            const response = await AutomatedResponseService.getResponse();
            return res.send(response);
        })
}