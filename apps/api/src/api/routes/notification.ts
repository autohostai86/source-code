import NotificationService from '@app/services/NotificationService';
import { Request, Response, Router } from 'express';
import { celebrate, Joi } from 'celebrate';
const route = Router()

export default (app: Router) => {
    app.use('/notification', route);
    route.post(
        '/mail',
        celebrate({
            body: Joi.object({
                email: Joi.string().required(),
                name: Joi.string().required(),
                mobileNo: Joi.string().required(),
                message: Joi.string().required(),
            }),
        }),
        async (req: Request, res: Response) => {
            const response = await NotificationService.sendContactMail(req.body);
            return res.send(response);
        }
    );


    route.get(
        '/expiry-email',
        async (req: Request, res: Response) => {
            const response = await NotificationService.sendExpiryEmail();
            return res.send(response);
        }
    );

    route.get(
        '/deactivate-plan',
        async (req: Request, res: Response) => {
            const response = await NotificationService.deactivatePlan();
            return res.send(response);
        }
    )
}