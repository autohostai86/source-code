import API from '../utils/API';
import LogService from './LogService';

class SettingsService {

  async createSettings(reqData) {
    const response = await API.post('/settings/create', reqData)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        LogService.error(
          `SettingsService -> createSettings -> error: ${JSON.stringify(error)}`
        );
        return { error: true, msg: 'Internal server error' };
      });
    return response;
  }

  async getSetting(reqData) {
    const response = await API.get(`/settings/get-by-user${reqData}`)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        LogService.error(
          `SettingsService -> getSetting -> error: ${JSON.stringify(error)}`
        );
        return { error: true, msg: 'Internal server error' };
      });
    return response;
  }

    async generateToken(reqData) {
      const response = await API.post(`/settings/generate-token`, reqData)
      .then((res) => {
          return res.data;
      })
      .catch((err) => {
          LogService.error(`BotService -> generateToken -> error: ${JSON.stringify(err)}`);
          return { error: true, msg: 'Internal server error' }

      });
      return response;
  }
}

export default new SettingsService();
