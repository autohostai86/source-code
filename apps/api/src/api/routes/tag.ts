import TagService from '@app/services/TagService';
import { Request, Response, Router } from 'express';

const route = Router()

export default (app: Router) => {
    app.use('/tags', route);
    route.post(
        '/create',
        async (req: Request, res: Response) => {
            const response = await TagService.createTag(req.body);
            return res.send(response);
        }),

        route.post(
            '/delete',
            async (req: Request, res: Response) => {
                const response = await TagService.deleteTag(req.body);
                return res.send(response);
            }),

        route.post(
            '/get-by-search',
            async (req: Request, res: Response) => {
                const response = await TagService.getTagBySearch(req.body);
                return res.send(response);
            })

    route.post(
        '/get-all',
        async (req: Request, res: Response) => {
            const response = await TagService.getAllTags(req.body);
            return res.send(response);
        })

    route.post(
        '/edit',
        async (req: Request, res: Response) => {
            const response = await TagService.editTag(req.body);
            return res.send(response);
        })
}