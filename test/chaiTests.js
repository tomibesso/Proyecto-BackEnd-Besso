import chai from 'chai'
import mongoose from 'mongoose'
import userManager from '../src/dao/Mongo/UserDAOMongo.js'

const expect = chai.expect
mongoose.connect('') // Usar otra base de datos, la local por ejemplo

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
        // expect(result).to.be.deep.equal([])
        // expect(result).deep.equal([])
        // expect(Array.isArray(result)).to.be.ok
        // expect(Array.isArray(result)).to.be.equals(true)
    })

    
})