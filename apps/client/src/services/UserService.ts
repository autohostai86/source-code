import API from '../utils/API';
import LogService from './LogService';

class UserService {
async fetchUser (){
    const response = await API.get('/user/get-all')
    .then((res)=>{
        // console.log(res.data);
        return res.data
    })
    .catch((error)=>{
        LogService.error(`UserService -> fetchUser -> error: ${JSON.stringify(error)}`);
        return { error: true, msg: 'Internal server error' }
    })
    return response;
    }

async createuser (reqData){
    const response = await API.post('/user/create',reqData)
    .then((res)=>{
        return res.data
    })
    .catch((error)=>{
        LogService.error(`UserService -> createUser -> error: ${JSON.stringify(error)}`);
        return { error: true, msg: 'Internal server error' }
    })
    return response;
}

async deleteUser (reqData){
    const response = await API.post('/user/delete',reqData)
    .then((res)=>{
        return res.data
    })
    .catch((error)=>{
        LogService.error(`UserService -> deleteUser -> error: ${JSON.stringify(error)}`);
        return { error: true, msg: 'Internal server error' }
    })
    return response;
}

async editUser (reqData){
// console.log(reqData)
    const response = await API.post('/user/edit',reqData)
    .then((res)=>{
        return res.data
    })
    .catch((error)=>{
        LogService.error(`UserService -> editUser -> error: ${JSON.stringify(error)}`);
        return { error: true, msg: 'Internal server error' }
    })
    return response;
}
}

export default new UserService()