import DashboardService from '@app/services/DashboardService';
import { Request, Response, Router } from 'express';

const route = Router()

export default (app: Router) => {
    app.use('/dashboard', route);

    route.post('/contact', async (req: Request, res: Response) => {
        const response = await DashboardService.contactEmail(req.body);
        return res.send(response);
    });

    route.post('/get-counts', async (req: Request, res: Response) => {
        const response = await DashboardService.getCounts(req.body);
        return res.send(response);
    });


}