import chai from 'chai'
import mongoose from 'mongoose'
import userManager from '../src/dao/Mongo/UserDAOMongo.js'
import { createHash, isValidPassword } from '../src/utils/bcrypt.js'
import UserDto from '../src/dtos/usersDTO.js'

const expect = chai.expect

describe('Test de Hands On Lab (bcrypt)', () => {
    it('El servicio debe devolver un hasheo efectivo del password', async () => {
        const password = '123456'
        const hashedPassword = createHash(password)

        console.log(hashedPassword);

        expect(hashedPassword).to.not.equal(password)
    })

    it('El hasheo realizado debe poder compararse de manera efectiva con la password original.', async () => {
        const password = '123456'
        const hashedPassword = createHash(password)

        const ValidPassword = isValidPassword(password, hashedPassword)

        // expect(ValidPassword).to.be.ok
        expect(ValidPassword).to.be.true
    })

    it('El hasheo realizado al ser alterado debe fallar el test.', async () => {
        const password = '123456'
        const hashedPassword = createHash(password)
        const hashAlterado = hashedPassword+'10'

        const ValidPassword = isValidPassword(password, hashedPassword)

        expect(ValidPassword).to.be.false
    })
})

describe('Testing del userDTO', () => {
    before(function () {
        this.userDto = UserDto
    })

    it('El DTO debe unificar el nombre y apellido en una única propiedad llamada fullName.', function() {
        const userMock = {
            firstName: 'Tomas',
            lastName: 'Besso',
            age: 24,
            email: 'tomi.besso12@gmail.com',
            password: '123456'
        }

        const userDTO = this.userDto(userMock)

        expect(userDTO).to.have.property('fullName', 'Tomas Besso')
    })

    it('El DTO debe unificar el nombre y apellido en una única propiedad llamada fullName.', function() {
        const userMock = {
            firstName: 'Tomas',
            lastName: 'Besso',
            age: 24,
            email: 'tomi.besso12@gmail.com',
            password: '123456'
        }

        const userDTO = this.userDto(userMock)

        expect(userDTO).to.not.have.property('middleName')
        expect(userDTO).to.not.have.property('gender')
    })
})
