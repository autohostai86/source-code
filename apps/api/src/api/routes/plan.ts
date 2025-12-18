import { celebrate, Joi } from 'celebrate';
import { Request, Response, Router } from 'express';
import subscribedPlans from './subscribedPlans';
import subscribedPlansService from '@app/services/subscribedPlansService';

const route = Router()

export default (app: Router) => {
    app.use('/plan', route);



    route.get(
        '/get-by-id',
        async (req: Request, res: Response) => {
            const response = await subscribedPlansService.getplanById(req.query);
            return res.send(response);
        })
    route.post(
        '/make-payment',
        async (req: Request, res: Response) => {
            const response = await subscribedPlansService.makePayment(req.body);
            return res.send(response);
        })
    route.post(
        '/create-order',
        async (req: Request, res: Response) => {
            const response = await subscribedPlansService.createOrder(req.body);
            return res.send(response);
        })




}