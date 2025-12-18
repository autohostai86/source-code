import UserService from '@app/services/UserService';
import { celebrate, Joi } from 'celebrate';
import { Request, Response, Router } from 'express';

const route = Router()

export default (app:Router)=>{
    app.use('/user', route);
    route.post(
        '/create',
        async (req: Request, res: Response) => {
            const response = await UserService.createUser(req.body);
            return res.send(response);
        }),
    
    route.post(
        '/delete',
        async (req: Request, res: Response) => {
            const response = await UserService.deleteUser(req.body);
            return res.send(response);
        }),
    
    route.post(
        '/get-by-id',
        async (req: Request, res: Response) => {
            const response = await UserService.getUserById(req.body);
            return res.send(response);
        })
    
    route.get(
        '/get-all',
        async (req: Request, res: Response) => {
            const response = await UserService.getAllUser();
            return res.send(response);
        })

    route.post(
        '/edit',
        async (req: Request, res: Response) => {
            const response = await UserService.editUser(req.body);
            return res.send(response);
        })
}