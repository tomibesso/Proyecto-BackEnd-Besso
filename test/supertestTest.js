import { expect } from 'chai'
import mongoose from 'mongoose'
import supertest from 'supertest'
import { objectConfig } from '../src/config/index.js'
import { request } from 'express'

const mongoURL = objectConfig.mongoURL
mongoose.connect(mongoURL)


// Debemos tener (en otra terminal) nuestro servidor levantado para poder ejecutar los endpoints

const requester = supertest('http://localhost:8080')

describe('Test del Proyecto BackEnd', () => {
    // Tests de Products (hacer de: get, getBy, addProduct, updateProduct y deleteProduct)
    describe('Test de Producto', () => {
        let cookie;
        const userMock = {
            firstName: 'Tomas',
            lastName: 'Besso',
            age: '24',
            email: 'tomi.besso12@gmail.com',
            password: '123456'
        }

        const productMock = {
            title: 'Producto Test',
            description: 'Descripcion Test',
            price: 200,
            thumbnails: 'Thumbnails Test',
            code: 'Codigo Test',
            stock: 25,
            category: 'Categoria Test'
        }

        before(async () => {
            await mongoose.connection.collection('products').deleteMany({})
            await mongoose.connection.collection('users').deleteMany({})

            const registerResult = await requester.post('/api/sessions/register').send(userMock)
            const registeredUserId = registerResult._body.user._id

            await requester.put(`/api/users/premium/${registeredUserId}`)

            const userMockLogin = {
                email: userMock.email,
                password: userMock.password
            }
            
            const loginResult = await requester.post('/api/sessions/login').send(userMockLogin)
            const cookieResult = loginResult.headers['set-cookie'][0];

            cookie = {
                name: cookieResult.split('=')[0],
                value: cookieResult.split('=')[1].split(';')[0]
            }            
        })

        it('Endpoint POST /api/products debe crear un producto correctamente', async () => {
            const { statusCode, ok, _body } = await requester.post('/api/products')
                .set('cookie', `${cookie.name}=${cookie.value}`)
                .send(productMock)

            expect(_body.payload).to.be.an('object')
            expect(statusCode).to.be.equal(201)
            expect(ok).to.be.equal(true)
            expect(_body.payload).to.have.property('_id')
        })

        it('Endpoint GET /api/products debe traer todos los productos correctamente', async () => {
            const {statusCode, ok, _body } = await requester.get('/api/products')
                       
            expect(ok).to.be.equal(true)
            expect(statusCode).to.be.equal(200)
            expect(_body.payload).to.be.an('array')
        })

        it('Endpoint GET /api/products/pid debe traer un producto correctamente', async () => {
            const products = await requester.get('/api/products')
            const pid = products._body.payload[0]._id

            const {statusCode, ok, _body } = await requester.get(`/api/products/${pid}`)

            expect(ok).to.be.equal(true)
            expect(statusCode).to.be.equal(200)
            expect(_body).to.have.property('_id')
            expect(_body).to.be.an('object')
        })

        it('Endpoint PUT /api/products/pid debe actualizar un producto correctamente', async () => {
            const products = await requester.get('/api/products')
            const pid = products._body.payload[0]._id
            

            const updatedProduct = {
                title: 'Producto Actualizado',
                description: 'Descripcion Actualizada',
                price: 300,
                thumbnails: 'Thumbnails Actualizado',
                code: 'Codigo Actualizado',
                stock: 50,
                category: 'Categoria Actualizada'
            }

            const { statusCode, ok, _body } = await requester.put(`/api/products/${pid}`)
                .set('cookie', `${cookie.name}=${cookie.value}`)
                .send(updatedProduct)

            expect(statusCode).to.be.equal(200)
            expect(ok).to.be.equal(true)
            expect(_body.message).to.be.equal(`Producto con ID ${pid} actualizado correctamente`)
            expect(_body.updatedProduct.title).to.be.equal(updatedProduct.title)
            expect(_body.updatedProduct).to.be.an('object')

        }) 

        it('Endpoint DELETE /api/products/pid debe eliminar un producto correctamente', async () => {
            const products = await requester.get('/api/products')
            const pid = products._body.payload[0]._id

            const { statusCode, ok, _body } = await requester.delete(`/api/products/${pid}`)
                .set('cookie', `${cookie.name}=${cookie.value}`)

            expect(statusCode).to.be.equal(200)
            expect(ok).to.be.equal(true)
            expect(_body.message).to.be.equal(`Producto con ID: ${pid} eliminado correctamente`)
        })
    })

    describe('Test de Session', () => {
        let cookie
        const userMock = {
            firstName: 'Tomas',
            lastName: 'Besso',
            age: '24',
            email: 'tomi.besso12@gmail.com',
            password: '123456',
            role: "premium"
        }

        before(async function() {
            await mongoose.connection.collection('users').deleteMany({})
        });
        
        it('Debe registrar correctamente a un usuario', async () => {
            const { _body, statusCode, ok } = await requester.post('/api/sessions/register').send(userMock)
            
            expect(_body).to.be.ok
            expect(_body.user).to.be.an('object')
            expect(statusCode).to.be.equal(200)
            expect(ok).to.be.true
        })

        it('Debe loguear correctamente a un usuario y devolver una cookie', async () => {
            const userMockLogin = {
                email: userMock.email,
                password: userMock.password
            }

            const result = await requester.post('/api/sessions/login').send(userMockLogin)
            
            const cookieResult = result.headers['set-cookie'][0]
            
            cookie = {
                name: cookieResult.split('=')[0],
                value: cookieResult.split('=')[1]
            }
            
            expect(cookie.name).to.be.ok.and.equal('TomiCookieToken')
            expect(cookie.value).to.be.ok
        })

        it('Debe enviar la cookie que contiene el usuario y destructurar este correctamente', async () => {
            const { _body, statusCode, ok } = await requester.get('/api/sessions/current').set('cookie', [`${cookie.name}=${cookie.value}`])
            
            expect(_body.user.email).to.be.equal(userMock.email)
            expect(ok).to.be.true
            expect(statusCode).to.be.equal(200)
        })

        // it() // resetPassword
    })

    // tests de Carts (hacer de: addCart, getCartById, addProductToCart, purchaseProducts)
    // describe('Test de Carts', () => {
    //     it() // addCart

    //     it() // getCartById
        
    //     it() // addProductToCart
        
    //     it() // purchaseProducts
    // })
})