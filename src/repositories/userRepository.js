import UserDto from "../dtos/usersDTO.js"

export default class UserRepository {
    constructor(usersDao){
        this.usersDao = usersDao
    }

    getUsers    = async () => await this.usersDao.getAll()

    getUser     = async filter => await this.usersDao.getBy(filter)

    getUserById = async id => await this.usersDao.getById(id)

    addUser  = async (firstName, lastName, email, password, age) => {
        const newUser = new UserDto(firstName, lastName, email, password, age)
        return await this.usersDao.create(newUser)        
    }

    updateUser  = async (id, updateData) => await this.usersDao.update(id, updateData)
    
    deleteUser  = async id => await this.usersDao.delete(id)
}