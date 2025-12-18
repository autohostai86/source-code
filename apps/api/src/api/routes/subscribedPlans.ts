import subscribedPlansService from '@app/services/subscribedPlansService';
import { Request, Response, Router } from 'express';

const route = Router();

export default (app: Router) => {
  app.use('/subscribedplans', route);
  route.get('/getbyuserid', async (req: Request, res: Response) => {
    const response = await subscribedPlansService.getSubscribePlansByUserId(req.body);
    return res.send(response);
  })

  route.post('/create', async (req: Request, res: Response) => {
    const response = await subscribedPlansService.createSubscibePlans(req.body);
    return res.send(response);
  })

  route.post('/delete', async (req: Request, res: Response) => {
    const response = await subscribedPlansService.deleteSubscibePlans(
      req.body
    );
    return res.send(response);
  })

  route.post('/edit', async (req: Request, res: Response) => {
    const response = await subscribedPlansService.editSubscibePlans(req.body);
    return res.send(response);
  });

  route.post('/get-current-subscription', async (req: Request, res: Response) => {
    const response = await subscribedPlansService.getCurrentSubscription(req.body);
    return res.send(response);
  });

  route.post('/add-credits', async (req: Request, res: Response) => {
    const response = await subscribedPlansService.updateTransactionData(req.body);
    return res.send(response);
  });

  route.post('/change', async (req: Request, res: Response) => {
    const response = await subscribedPlansService.changeSubscription(req.body);
    return res.send(response);
  });

  route.post('/get-transcations', async (req: Request, res: Response) => {
    const response = await subscribedPlansService.getTransactions(req.body);
    return res.send(response);
  });
};
