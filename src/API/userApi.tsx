import axios from "axios";


const Register = async (user: userRegister): Promise<any> => {
    let URL = 'http://localhost:4941/api/v1/'
    return await axios.post(URL+'users/register', {"firstName": user.firstName, "lastName": user.lastName,
        "email": user.email, "password": user.password})
}

const Login = async (user: userLogin): Promise<any> => {
    let URL = 'http://localhost:4941/api/v1/'
    return await axios.post(URL+'users/login', {"email": user.email, "password": user.password})
}

const Logout = async (token: any): Promise<any> => {
    let URL = 'http://localhost:4941/api/v1/'
    return await axios.post(URL+'users/logout', {}, {headers: {'X-Authorization': token}})
}

const getUser = async (user_id: number, token:any): Promise<any> => {
    let URL = 'http://localhost:4941/api/v1/'
    return await axios.get(URL+'users/'+user_id, {headers: {'X-Authorization': token}})
}

const editUser = async (user_id: number, token:any, firstName: any, lastName: any, email:any, currentPass: any, newPass: any) => {
    let URL = 'http://localhost:4941/api/v1/'
    if (newPass !== '' && currentPass !== '') {
        return await axios.patch(URL+'users/'+user_id, {firstName: firstName, lastName: lastName, email:email, currentPassword: currentPass, password: newPass},
            {headers: {'X-Authorization': token}})
    } else {
        return await axios.patch(URL+'users/'+user_id, {firstName: firstName, lastName: lastName, email:email},
            {headers: {'X-Authorization': token}})
    }
}




export {Register, Login, Logout, getUser, editUser}