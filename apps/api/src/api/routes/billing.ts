import BillingService from '@app/services/BillingService';
import { Request, Response, Router } from 'express';

const route = Router()

export default (app: Router) => {
    app.use('/billing', route);
    route.post(
        '/create',
        async (req: Request, res: Response) => {
            const response = await BillingService.createBillings(req.body);
            return res.send(response);
        }),

        route.post(
            '/delete',
            async (req: Request, res: Response) => {
                const response = await BillingService.deleteBilling(req.body);
                return res.send(response);
            }),

        route.post(
            '/get-by-title',
            async (req: Request, res: Response) => {
                const response = await BillingService.getBillingByTitle(req.body.title);
                return res.send(response);
            })

    route.get(
        `/get-all`,
        async (req: Request, res: Response) => {
            const { offset, limit, filter, orderBy, orderDir } = req.query;
            const response = await BillingService.getAllBilling(offset, limit, filter, orderBy, orderDir);
            return res.send(response);
        })

    route.post(
        '/edit',
        async (req: Request, res: Response) => {
            const response = await BillingService.editBilling(req.body);
            return res.send(response);
        })
}