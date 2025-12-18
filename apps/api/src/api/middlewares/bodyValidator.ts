/** @format */

import { celebrate, Joi } from 'celebrate';

function bodyValidator(params: [{ field: string; type: string | {} }]) {
    let paramsObject = {};
    params.map((paramsObj) => {
        console.log('MyValidatation -> paramsObj', paramsObj);
        // UPDATE TYPES AS NEEDED
        if (paramsObj['type'] == 'string') {
            paramsObject = { ...paramsObject, [paramsObj['field']]: Joi.string().required() };
        } else if (paramsObj['type'] == 'number') {
            paramsObject = { ...paramsObject, [paramsObj['field']]: Joi.number().required() };
        } else if (typeof paramsObj['type'] == 'object') {
            paramsObject = { ...paramsObject, [paramsObj['field']]: Joi.object().required() };
        }
    });

    return celebrate({
        body: Joi.object({
            ...paramsObject,
        }),
    });
}
export default bodyValidator;
