import NearBySpotsService from '@app/services/NearBySpotsService';
import { Request, Response, Router } from 'express';

const route = Router()

export default (app: Router) => {
    app.use('/near-by-spots', route);

    route.post(
        '/add',
        async (req: Request, res: Response) => {
            const response = await NearBySpotsService.addSpots(req.body);
            return res.send(response);
        }),

        route.post(
            '/delete',
            async (req: Request, res: Response) => {
                const response = await NearBySpotsService.deleteSpots(req.body);
                return res.send(response);
            }),

        route.post(
            '/get-all',
            async (req: Request, res: Response) => {
                const response = await NearBySpotsService.getAllSpots(req.body);
                return res.send(response);
            })

    route.post(
        '/edit',
        async (req: Request, res: Response) => {
            const response = await NearBySpotsService.editSpots(req.body);
            return res.send(response);
        })

    route.get(
        '/map',
        async (req: Request, res: Response) => {
            const { destination, originLat, originLng } = req.query
            const response = await NearBySpotsService.getPlaceDetails(destination, originLat, originLng);
            return res.send(response);
        })
}