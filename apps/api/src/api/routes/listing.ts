import ListingServices from '@app/services/ListingServices';
import { Request, Response, Router } from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';

const route = Router()

const maxSize = 5368709120;


function saveImgToDirectory(cb, botId) {
    const dir = `./uploads/listingImages/${botId}`;
    fs.mkdir(dir, { recursive: true }, err => {
        if (err) {
            return '';
        }
        return cb(null, dir);
    });
    return '';
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        saveImgToDirectory(cb, req.body.botId);
    },

    filename: function (req, file, cb) {
        const extName = path.extname(file.originalname);
        //

        cb(null, `${Date.now()}${extName}`);
    },
});


const upload = multer({ storage: storage, limits: { fileSize: maxSize } });

export default (app: Router) => {
    app.use('/listing', route);
    route.post('/get-all',
        async (req: Request, res: Response) => {
            const response = await ListingServices.getAllListing(req.body);
            return res.send(response);
        }
    );

    route.post(
        '/add',
        upload.array('files'),
        async (req: Request, res: Response) => {
            const reqData = req.body;
            // @ts-ignore
            const images = req.files?.length > 0 ? req.files : [];
            reqData['listing'] = JSON.parse(reqData['listing']);

            if (reqData.listing.length === 1 ) {
                reqData['listing'][0]['images'] = images;
            } else if (reqData.listing.length > 1) {
                reqData['listing'][reqData.listing.length - 1]['images'] = images;
            }
            
            const response = await ListingServices.addListing(reqData);
            return res.send(response);
        }
    );

    route.post(
        '/add-pms-data',
        async (req: Request, res: Response) => {
            const reqData = req.body;
            const response = await ListingServices.addListing(reqData);
            return res.send(response);
        }
    );

    route.post(
        '/updateListing',
        async (req: Request, res: Response) => {
            const response = await ListingServices.updateListing(req.body);
            return res.send(response);
        }
    );

    route.post(
        '/deleteListing',
        async (req: Request, res: Response) => {
            const response = await ListingServices.deleteListing(req.body);
            return res.send(response);
        }
    );

    route.post(
        '/ai-respond-status',
        async (req: Request, res: Response) => {
            const response = await ListingServices.responderStatus(req.body);
            return res.send(response);
        }
    );

    route.get(
        '/get-lat-long',
        async (req: Request, res: Response) => {
            const response = await ListingServices.getLatLngOfAddress(req.query);
            return res.send(response);
        }
    );


}