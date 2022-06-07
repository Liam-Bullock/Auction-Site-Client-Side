import axios from "axios";


const putImageUser = async (user_id: number, token: any, image: any): Promise<any> => {
    let URL = 'http://localhost:4941/api/v1/'
    return await axios.put(URL+'users/'+user_id+'/image', image, {headers: {'X-Authorization': token, 'Content-Type':image.type}})
}

const getImageUser = async (user_id: number): Promise<any> => {
    let URL = 'http://localhost:4941/api/v1/'
    return await axios.get(URL+'users/'+user_id+'/image', {responseType: 'blob'})
}

const deleteImageUser = async (user_id: number, token: any): Promise<any> => {
    let URL = 'http://localhost:4941/api/v1/'
    return await axios.delete(URL+'users/'+user_id+'/image',{headers: {'X-Authorization': token}})
}
export {putImageUser, getImageUser, deleteImageUser}