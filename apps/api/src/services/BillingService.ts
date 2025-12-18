/** @format */

import billingModel from '@app/models/billingModel';
import logger from '@app/loaders/logger';

class BillingService {
  async createBillings(reqData): Promise<any> {
    try {
      const user = await billingModel.create(reqData);
      return { error: false, msg: 'success' };
    } catch (error) {
      logger.error(
        `BillingServices -> createBilling -> error: ${error.message}`
      );
      return { error: true, msg: 'Internal server error' };
    }
  }
  async deleteBilling(reqData): Promise<any> {
    try {
      const delUser = await billingModel.findByIdAndDelete(reqData['_id']);
      return { error: false, msg: 'success' };
    } catch (error) {
      logger.error(
        `BillingServices -> deleteBilling -> error: ${error.message}`
      );
      return { error: true, msg: 'Internal server error' };
    }
  }

  async getBillingByTitle(reqData): Promise<any> {
    try {
      const getUser = await billingModel.find({ title: { $regex: reqData, $options: 'i' } });
      if (getUser.length > 0) {
        return { error: false, msg: 'success', data: getUser };
      } else {
        return { error: false, msg: 'Billing not found' };
      }
    } catch (error) {
      logger.error(
        `BillingServices -> getBillingById -> error: ${error.message}`
      );
      return { error: true, msg: 'Internal server error' };
    }
  }

  async getAllBilling(offset, limit, filter, orderBy, orderDir): Promise<any> {
    try {
      const offsetNumber = parseInt(offset);
      const limitNumber = parseInt(limit);
      let data: any = '';
      const finalFilter = JSON.parse(filter);
      const count = await billingModel.countDocuments();
      if (typeof finalFilter !== 'string') {
        if (orderBy != 0 && orderDir != 0) {
          const order = orderDir === 'asc' ? 1 : -1;
          data = await billingModel
            .find(finalFilter)
            .skip(offsetNumber * limitNumber)
            .limit(limitNumber)
            .sort({ [orderBy]: order });
        } else {
          data = await billingModel
            .find(finalFilter)
            .skip(offsetNumber * limitNumber)
            .limit(limitNumber)
            .sort({ createdAt: -1 });
        }
      } else {
        if (orderBy != 0 && orderDir != 0) {
          const order = orderDir === 'asc' ? 1 : -1;
          data = await billingModel
            .find()
            .skip(offsetNumber * limitNumber)
            .limit(limitNumber)
            .sort({ [orderBy]: order });
        } else {
          data = await billingModel
            .find()
            .skip(offsetNumber * limitNumber)
            .limit(limitNumber)
            .sort({ createdAt: -1 });
        }
      }
      return { error: false, data: data, count: count };
    } catch (error) {
      logger.error(
        `BillingService -> getAllBilling -> error: ${error.message}`
      );
      return { error: true, msg: 'Internal server error' };
    }
  }

  async editBilling(reqData): Promise<any> {
    try {
      if (reqData.id) {
        const editBilling = await billingModel.findByIdAndUpdate(
          reqData.id,
          reqData
        );
        return { error: false, msg: 'success', data: editBilling };
      } else {
        logger.error(`BillingService -> editBilling -> Billing ID not found.`);
        return { error: true, msg: 'Internal server error' };
      }
    } catch (error) {
      logger.error(`BillingService -> editBilling -> error: ${error.message}`);
      return { error: true, msg: 'Internal server error' };
    }
  }
}

export default new BillingService();
