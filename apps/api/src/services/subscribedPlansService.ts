/** @format */

import logger from '@app/loaders/logger';
import billingModel from '@app/models/billingModel';
import loginModel from '@app/models/loginModel';

import subscribedPlansModel from '@app/models/subscribedPlansModel';
import { json } from 'body-parser';
import e from 'express';
import mongoose from 'mongoose';
import Razorpay from 'razorpay';
var ObjectId = require("mongodb").ObjectId;

class SubscribedPlansService {
  async getSubscribePlansByUserId(reqData): Promise<any> {
    try {
      const getSubscribePlans = await subscribedPlansModel.find({
        userId: reqData['userId'],
      });
      if (getSubscribePlans) {
        return { error: false, msg: 'success', data: getSubscribePlans };
      } else {
        return { error: false, msg: 'Subscribed plane not exist' };
      }
    } catch (error) {
      logger.error(
        `SubscribedPlansService -> getSubscribePlansByUserId -> error: ${error.message}`
      );
      return { error: true, msg: 'Internal server error' };
    }
  }

  async createSubscibePlans(reqData): Promise<any> {
    try {
      const userId = await loginModel.findById(reqData['userId']);
      const billingId = await billingModel.findById(reqData['billingId']);
      if (userId && billingId) {
        const subscibePlans = await subscribedPlansModel.create(reqData);
        return { error: false, msg: 'success' };
      } else {
        return { error: false, msg: 'UserId or billingId does not exist' };
      }
    } catch (error) {
      logger.error(
        `SubscribePlansService -> createSubscibePlans -> error: ${error.message}`
      );
      return { error: true, msg: 'Internal server error' };
    }
  }
  async deleteSubscibePlans(reqData): Promise<any> {
    try {
      const delSubscibePlans = await subscribedPlansModel.findByIdAndDelete(
        reqData['_id']
      );
      return { error: false, msg: 'success' };
    } catch (error) {
      logger.error(
        `SubscribePlansService -> deleteSubscibePlans -> error: ${error.message}`
      );
      return { error: true, msg: 'Internal server error' };
    }
  }

  async editSubscibePlans(reqData): Promise<any> {
    try {
      if (reqData.id) {
        const editSubscibePlans = await subscribedPlansModel.findByIdAndUpdate(
          reqData.id,
          reqData
        );
        return { error: false, msg: 'success', data: reqData };
      } else {
        logger.error(`SubscribePlansService -> editSubscibePlans`);
        return { error: true, msg: 'Internal server error' };
      }
    } catch (error) {
      logger.error(
        `SubscribePlansService -> editSubscibePlans -> error: ${error.message}`
      );
      return { error: true, msg: 'Internal server error' };
    }
  }
  // here started logic for payment 
  async getplanById(reqData): Promise<any> {
    try {
      let matchStage = {};
      const pipeline: any[] = [];

      // Here is the pagination code
      const offsetNumber = parseInt(reqData.offset);
      const limitNumber = parseInt(reqData.limit);
      const order = reqData.orderDir === 'asc' ? 1 : -1;
      const sortField = reqData.orderBy && reqData.orderDir ? reqData.orderBy : 'createdAt';
      const sortOrder = reqData.orderBy && reqData.orderDir ? order : -1;
      let arrayBotFilter = [];
      let botFilterFlag = true;
      let arrayBillingFilter = [];
      let billingFilterFlag = true;

      if (reqData.userType === 'admin') {
        if (reqData.coloumnTitleFilter && reqData.coloumnTitleFilter.length > 0 && reqData.valueInputSearch) {
          matchStage = {
            $match: {
              userId: new ObjectId(reqData.valueInputSearch)
            }
          }
          pipeline.push(matchStage);
        } else {
          matchStage = {
            $match: {}
          }
          pipeline.push(matchStage);
        }
      } else {
        if (reqData.userId) {
          matchStage = {
            $match: {
              userId: new ObjectId(reqData.userId)
            }
          }
          pipeline.push(matchStage);
        }
      }

      const filters: any = {};
      if (reqData.coloumnTitleFilter && reqData.coloumnTitleFilter.length > 0) {
        if (reqData.coloumnTitleFilter === "Bot") {
          botFilterFlag = false;
          arrayBotFilter.push({
            $match: { title: { $regex: reqData.valueInputSearch, $options: 'i' } }
          })

        } else if (reqData.coloumnTitleFilter === "Billing Title") {
          billingFilterFlag = false;
          arrayBillingFilter.push({
            $match: { title: { $regex: reqData.valueInputSearch, $options: 'i' } }
          })
        }
        else if (reqData.coloumnTitleFilter === "Billing Duration") {
          billingFilterFlag = false;
          arrayBillingFilter.push({
            $match: { durationType: { $regex: reqData.valueInputSearch, $options: 'i' }, }
          })
        }
        else if (reqData.coloumnTitleFilter === "Expiry Date") {
          pipeline.push({
            $match: { expiryDate: new Date(reqData.valueInputSearch), }
          })
        }
        else if (reqData.coloumnTitleFilter === "Expiry Status") {
          let booleanValue;

          if (reqData.valueInputSearch.toLowerCase() === "true") {
            booleanValue = true;
          } else if (reqData.valueInputSearch.toLowerCase() === "false") {
            booleanValue = false;
          }
          pipeline.push({
            $match: { isExpired: booleanValue, }
          })
        }
        else if (reqData.coloumnTitleFilter === "Payment Status") {
          let booleanValue;

          if (reqData.valueInputSearch.toLowerCase() === "true") {
            booleanValue = true;
          } else if (reqData.valueInputSearch.toLowerCase() === "false") {
            booleanValue = false;
          }
          pipeline.push({
            $match: { paymentStatus: booleanValue, }
          })
        }
      }



      // Aggregation pipeline
      pipeline.push(
        {
          $lookup: {
            from: 'billings', // The name of the billing collection
            localField: 'billingId',
            foreignField: '_id',
            as: 'billings',
            pipeline: arrayBillingFilter,

          },
        },
        { $unwind: { path: '$billings', preserveNullAndEmptyArrays: billingFilterFlag } },
        {
          $lookup: {
            from: 'admins', // The name of the Admins collection
            localField: 'userId',
            foreignField: '_id',
            pipeline: reqData.search ? [{ $match: { userName: { $regex: reqData.search, $options: 'i' } } }] : [],
            as: 'users',
          },
        },
        { $unwind: { path: '$users', preserveNullAndEmptyArrays: reqData.search ? false : true } },
        {
          $lookup: {
            from: 'bots', // The name of the bot collection
            localField: 'botId',
            foreignField: '_id',
            pipeline: arrayBotFilter,
            as: 'bots',
          },
        },
        { $unwind: { path: '$bots', preserveNullAndEmptyArrays: botFilterFlag } }
      );

      // Additional search filters for main document
      // if (reqData.search) {
      //   pipeline.push({
      //     $match: {
      //       $or: [
      //         { 'users.userName': { $regex: reqData.search, $options: 'i' } },
      //         { 'bots.title': { $regex: reqData.search, $options: 'i' } },
      //         { 'billings.title': { $regex: reqData.search, $options: 'i' } },

      //       ]
      //     }
      //   });
      // }

      // Sorting
      pipeline.push({ $sort: { [sortField]: sortOrder } });

      // Pagination
      if (!isNaN(offsetNumber)) {
        pipeline.push({ $skip: offsetNumber });
      }
      if (!isNaN(limitNumber)) {
        pipeline.push({ $limit: limitNumber });
      }

      // Execute the aggregate query
      const data = await subscribedPlansModel.aggregate(pipeline);
      console.log(data);
      // Get the count of documents
      const countPipeline = [...pipeline];
      countPipeline.pop(); // Remove the $limit stage for count
      countPipeline.pop(); // Remove the $skip stage for count
      countPipeline.push({ $count: 'count' });
      const countResult = await subscribedPlansModel.aggregate(countPipeline);
      const count = countResult.length > 0 ? countResult[0].count : 0;

      return { error: false, data: data, count: count };
    } catch (error) {
      logger.error(`SubscribePlansService -> getplanById -> error: ${error.message}`);
      return { error: true, msg: 'Internal server error' }
    }
  }



  async makePayment
    (reqData): Promise<any> {
    try {
      logger.info(`SubscribePlansService ->  makePayment-> info: Start Code For Making Payment`);
      logger.info(`SubscribePlansService ->  makePayment-> info: Here is logic to calculate date using dynamics reqData.Expiry Mean validity Period`);
      const currentDate = new Date();
      const nextMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + reqData.Expiry, currentDate.getDate());
      const formattedNextMonthDate = `${nextMonthDate.getFullYear()}-${(nextMonthDate.getMonth() + 1).toString().padStart(2, '0')}-${nextMonthDate.getDate().toString().padStart(2, '0')}`;
      const transactionData = {
        paymentId: reqData.paymentId,
        signature: reqData.signature,
        paymentStatus: "Completed",
        orderId: reqData.orderId,
        receiptId: reqData.receiptId,
        amount: reqData.amount,
        createdAt: currentDate,
      };

      const editSuscribeData = await subscribedPlansModel.updateOne({
        _id: reqData.suscribeId,
      }, {
        billingId: reqData.billingId,
        expiryDate: formattedNextMonthDate,
        isExpired: false,
        $push: { transactions: transactionData }



      })
      if (editSuscribeData) {
        logger.info(`SubscribePlansService ->  makePayment-> info: Payment Done Then Sending Back Response`);
        return { error: false, msg: 'success' }
      } else {
        logger.info(`SubscribePlansService ->  makePayment-> info: Error Updating In The DataBase`);
        return { error: true, msg: 'Internal server error' }
      }

    } catch (error) {
      logger.error(`SubscribePlansService ->  makePayment-> error: ${error.message}`);
      return { error: true, msg: 'Internal server error' }
    }
  }
  async uniqueId() {
    const dateString = Date.now().toString(36);
    const randomness = Math.random().toString(36).substr(2);
    return dateString + randomness;
  };
  async createOrder

    (reqData): Promise<any> {
    try {
      logger.info(`SubscribePlansService ->  createOrder-> info: Creating Order Here`);

      const uniqueId = await this.uniqueId();
      var instance = new Razorpay({
        key_id: 'rzp_test_fXmsjx95uQYbzA',
        key_secret: 'XFuLXfZfrNyE1zy0313hnWaA',
      });
      var options = {
        amount: reqData.price * 100,  // amount in the smallest currency unit
        currency: "INR",
        receipt: uniqueId
      };

      const order = await instance.orders.create(options);
      const newTransaction = {
        paymentId: "none",
        orderId: order.id,
        receiptId: uniqueId,
        signature: "none",
        amount: order.amount,
        paymentStatus: "none"
      };
      return { error: false, data: newTransaction }

      // const updatedSubscription = await subscribedPlansModel.findOne({ _id: reqData.suscribeId });
      // logger.info(`SubscribePlansService ->  createOrder-> info: Updated Suscribed Table Succesfully`);
      // logger.info(`SubscribePlansService ->  createOrder-> info: Created Order Sucessfully `);
      // return { error: false, msg: 'success', data: order, updatedSubscription: updatedSubscription, newTransactionData: newTransaction }
    }
    catch (error) {
      logger.error(`SubscribePlansService ->  createOrder-> error: ${error.message}`);
      return { error: true, msg: 'Internal server error' }
    }
  }

  async getCurrentSubscription(reqData): Promise<any> {
    try {
      const userId = new mongoose.Types.ObjectId(reqData['userId']);
      const subscriptionData = await subscribedPlansModel.aggregate([
          {
              $match: { userId: userId }
          },
          {
              $lookup: {
                  from: "billings",
                  localField: "billingId",
                  foreignField: "_id",
                  as: "billingDetails"
              }
          },
          {
              $unwind: "$billingDetails"
          }
      ]);

      const availablePlans = await billingModel.find();

      return { error: false, data: subscriptionData, plans: availablePlans }
    } catch (error) {
      logger.error(`SubscribePlansService ->  getCurrentSubscription-> error: ${error.message}`);
      return { error: true, msg: 'Internal server error' }
    }
  }

  async updateTransactionData(reqData): Promise<any> {
    try {
       const update = await subscribedPlansModel.updateOne({
        _id: reqData.subscriptionId,
      }, {
        availableBalance: reqData["amount"],
        paymentStatus: true,
        $push: { transactions: reqData["transactionData"] }
      });

      return { error: false, msg: "Credit is added successfully." }
    } catch (error) {
      logger.error(`SubscribePlansService ->  updateTransactionData-> error: ${error.message}`);
      return { error: true, msg: 'Internal server error' }
    }
  }

  async changeSubscription(reqData): Promise<any> {
    try {
      const update = await subscribedPlansModel.findByIdAndUpdate(reqData["id"], {
        billingId: reqData["billingId"],
        availableBalance: reqData["amount"],
        paymentStatus: true,
        $push: { transactions: reqData["transactionData"] }
      });

      return { error: false, msg: "Plan is upgraded successfully." }
    } catch (error) {
      logger.error(`SubscribePlansService ->  changeSubscription-> error: ${error.message}`);
      return { error: true, msg: 'Internal server error' }
    }
  }


  async getTransactions(reqData): Promise<any> {
    try {
      const now = new Date();
      const startOfYear = new Date(now.getFullYear(), 0, 1); // Jan 1

      const from = Math.floor(startOfYear.getTime() / 1000);
      const to = Math.floor(Date.now() / 1000);

      const razorpay = new Razorpay({
        key_id: 'rzp_test_fXmsjx95uQYbzA',
        key_secret: 'XFuLXfZfrNyE1zy0313hnWaA',
      });

      const payments = await razorpay.payments.all({
        from,
        to,
        count: 100, // Adjust count or implement pagination if needed
      });
      console.log(payments);

      // Filter out failed payments
      const successfulPayments = payments.items.filter(payment => payment.status !== 'failed');

      return { error: false, data: successfulPayments }
    } catch (error) {
      logger.error(`SubscribePlansService ->  getTransactions-> error: ${error.message}`);
      return { error: true, msg: 'Internal server error' }
    }
  }
}

export default new SubscribedPlansService();
