import API from '../utils/API';
import LogService from './LogService';

class TagService {
    async fetchTags(reqData) {
        const response = await API.post(
            `/tags/get-all`,
            reqData
        )
            .then((res) => {
                // console.log(res.data);
                return res.data;
            })
            .catch((error) => {
                LogService.error(
                    `TagService -> fetchTags -> error: ${JSON.stringify(error)}`
                );
                return { error: true, msg: 'Internal server error' };
            });
        return response;
    }

    async createTag(reqData) {
        const response = await API.post('/tags/create', reqData)
            .then((res) => {
                return res.data;
            })
            .catch((error) => {
                LogService.error(
                    `TagService -> createTag -> error: ${JSON.stringify(error)}`
                );
                return { error: true, msg: 'Internal server error' };
            });
        return response;
    }

    async getTagBySearch(reqData) {
        const response = await API.post('/tags/get-by-search', reqData)
            .then((res) => {
                return res.data;
            })
            .catch((error) => {
                LogService.error(
                    `TagService -> getTagByTitle -> error: ${JSON.stringify(error)}`
                );
                return { error: true, msg: 'Internal server error' };
            });
        return response;
    }

    async deleteTag(reqData) {
        const response = await API.post('/tags/delete', reqData)
            .then((res) => {
                return res.data;
            })
            .catch((error) => {
                LogService.error(
                    `TagService -> deleteBilling -> error: ${JSON.stringify(error)}`
                );
                return { error: true, msg: 'Internal server error' };
            });
        return response;
    }

    async editTag(reqData) {
        const response = await API.post('/tags/edit', reqData)
            .then((res) => {
                return res.data;
            })
            .catch((error) => {
                LogService.error(
                    `TagService -> editTag -> error: ${JSON.stringify(error)}`
                );
                return { error: true, msg: 'Internal server error' };
            });
        return response;
    }
}

export default new TagService();
