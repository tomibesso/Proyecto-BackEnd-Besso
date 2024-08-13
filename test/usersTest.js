import userManager from '../src/dao/Mongo/UserDAOMongo.js'
import Asserts from 'assert'
import mongoose from 'mongoose'

mongoose.connect('mongodb://localhost:27017/')  // Usar otra base de datos, la local por ejemplo
const assert = Asserts.strict

describe('Test Users Dao', () => {
    before(function () {
        this.userDao = new userManager()
    })

    beforeEach(function () {
        mongoose.connection.collections.users.drop()
        this.timeout(5000)
    })
    it('El Dao debe obtener obtener los usuarios en formato arreglo', async function() {
        const result = await this.userDao.getAll()
        console.log(result);
        
        assert.strictEqual(Array.isArray(result), true)
    })
    it('El Dao debe agregar un usuario correctamente a la base de datos.', async function() {
        let mockUser = {
            firstName: 'Tomas',
            lastName: 'Besso',
            age: 24,
            email: 'tomi.besso12@gmail.com',
            password: '123456'
        }

        const result = await this.userDao.create(mockUser)
        assert.ok(result._id)
    })

    it('El Dao puede obtener un usuario por email.', async function() {
        let mockUser = {
            firstName: 'Tomas',
            lastName: 'Besso',
            age: 24,
            email: 'tomi.besso12@gmail.com',
            password: '123456'
        }

        const result = await this.userDao.create(mockUser)
        const user = await this.userDao.getBy({email: result.email})

        assert.strict(typeof user, 'object')
    })
})