import SettingsService from '@app/services/SettingsService';
import { Request, Response, Router } from 'express';

const route = Router()

export default (app:Router)=>{
    app.use('/settings', route);
    route.post(
        '/create',
        async (req: Request, res: Response) => {
            const response = await SettingsService.createOrUpdateSettings(req.body);
            return res.send(response);
        }
    );

    route.get(
        '/get-by-user',
        async (req: Request, res: Response) => {
            const response = await SettingsService.getSettingByUserId(req.query);
            return res.send(response);
        }
    );

    route.post(
        '/generate-token',
        async (req: Request, res: Response) => {
            const response = await SettingsService.genereateToken(req.body);
            return res.send(response);
        }
    );

}