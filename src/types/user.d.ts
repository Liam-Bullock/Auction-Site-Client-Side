type userRegister = {
    firstName: string,
    lastName: string,
    email: string,
    password: string,

}

type userLogin = {
    email: string,
    password: string
}

type loggedUser = {
    userId:number,
    authToken: string
}

type userUpdate = {
    firstName?: string
    lastName?: string,
    email?:string,
    password?:string,
    currentPassword?: string,
    changePass: boolean
}

type user = {
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    imageFilename: string,
    authToken: string
}

type userReturnWithEmail = {
    firstName: string,
    lastName: string,
    email:string
}

type userReturn = {
    firstName: string,
    lastName: string
}

type userPatch = {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    currentPassword: string
}
