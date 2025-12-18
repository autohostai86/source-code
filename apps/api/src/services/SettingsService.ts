/** @format */

import settingsModel from '@app/models/settingsModel';
import logger from '@app/loaders/logger';
import axios from 'axios';
import qs from 'qs';

class SettingsService {
  async createOrUpdateSettings(reqData): Promise<any> {
    try {
      if (reqData['_id']) {
        const settings = await settingsModel.findByIdAndUpdate(reqData['_id'], reqData);
      } else {
        const settings = await settingsModel.create(reqData);
      }
      return { error: false, msg: 'success' };
    } catch (error) {
      logger.error(
        `SettingsServices -> createSettings -> error: ${error.message}`
      );
      return { error: true, msg: 'Internal server error' };
    }
  }


  async getSettingByUserId(reqData): Promise<any> {
    try {
      const data = await settingsModel.findOne({userId: reqData['userId']});
      if (data !== null) {
        return { error: false, data: data }
      } else {
        logger.warn(`SettingsService -> getSettingByUserId -> record not exists`);
        return { error: true, msg: 'Record not exists' }
      }
    } catch (error) {
      logger.error(`SettingsService -> getSettingByUserId -> error: ${error.message}`);
      return { error: true, msg: 'Internal server error' };
    }
  }

  async genereateToken(reqData): Promise<any> {
    try {
      const formattedData = qs.stringify(reqData);
      console.log(formattedData);
      const response = await axios.post(`https://api.hostaway.com/v1/accessTokens`, formattedData, {
        headers: {
          'Cache-control': 'no-cache',
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      .then((res) => {
          const { access_token } = res.data
          if (access_token) {
              return { error: false, data: access_token }
          } else {
              return { error: true, msg: 'Sorry could not process your request at the moment' }
          }
      })
      .catch((err) => {
          logger.error(`BotService -> generateToken -> error: ${JSON.stringify(err)}`);
          return { error: true, msg: 'Internal server error' }

      });
      return response;
    } catch (error) {
      logger.error(`BotService -> generateToken -> error: ${JSON.stringify(error)}`);
      return { error: true, msg: 'Internal server error' }
    }
  }

}

export default new SettingsService();
