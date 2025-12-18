import API from '../utils/API';
import LogService from './LogService';

class BillinService {
  async fetchBilling(offset, limit, filter, orderBy, orderDir) {
    const response = await API.get(
      `/billing/get-all?offset=${offset}&limit=${limit}&filter=${filter}&orderBy=${orderBy}&orderDir=${orderDir}`
    )
      .then((res) => {
        // console.log(res.data);
        return res.data;
      })
      .catch((error) => {
        LogService.error(
          `BillingService -> fetchBilling -> error: ${JSON.stringify(error)}`
        );
        return { error: true, msg: 'Internal server error' };
      });
    return response;
  }

  async createBilling(reqData) {
    const response = await API.post('/billing/create', reqData)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        LogService.error(
          `BillingService -> createBilling -> error: ${JSON.stringify(error)}`
        );
        return { error: true, msg: 'Internal server error' };
      });
    return response;
  }

  async getBillingByTitle(reqData) {
    const response = await API.post('/billing/get-by-title', reqData)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        LogService.error(
          `BillingService -> getBillingByTitle -> error: ${JSON.stringify(error)}`
        );
        return { error: true, msg: 'Internal server error' };
      });
    return response;
  }

  async deleteBilling(reqData) {
    const response = await API.post('/billing/delete', reqData)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        LogService.error(
          `BillingService -> deleteBilling -> error: ${JSON.stringify(error)}`
        );
        return { error: true, msg: 'Internal server error' };
      });
    return response;
  }

  async editBilling(reqData) {
    const response = await API.post('/billing/edit', reqData)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        LogService.error(
          `BillingService -> editBilling -> error: ${JSON.stringify(error)}`
        );
        return { error: true, msg: 'Internal server error' };
      });
    return response;
  }
}

export default new BillinService();
