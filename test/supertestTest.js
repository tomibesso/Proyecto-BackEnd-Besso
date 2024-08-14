import { expect } from 'chai'
import mongoose from 'mongoose'
import supertest from 'supertest'
import { objectConfig } from '../src/config/index.js'

const mongoURL = objectConfig.mongoURL
mongoose.connect(mongoURL)

const requester = supertest('http://localhost:8080')

describe('Test del Proyecto BackEnd', () => {
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
            const productsCollection = await mongoose.connection.collection('products').deleteMany({})
            const usersCollection    = await mongoose.connection.collection('users').deleteMany({})
            const cartsCollection    = await mongoose.connection.collection('carts').deleteMany({})

            expect(productsCollection.acknowledged).to.be.equal(true)
            expect(usersCollection.acknowledged).to.be.equal(true)
            expect(cartsCollection.acknowledged).to.be.equal(true)
            

            const registerResult = await requester.post('/api/sessions/register').send(userMock)
            const registeredUserId = registerResult._body.user._id

            expect(registeredUserId).to.be.an('string')

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
            const { statusCode, ok, _body } = await requester.post('/api/products').set('cookie', `${cookie.name}=${cookie.value}`).send(productMock)

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
            
            expect(products._body.payload).to.be.an('array')
            expect(pid).to.be.an('string')

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

            expect(products._body.payload).to.be.an('array')
            expect(pid).to.be.an('string')

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
        
        it('Endpoint POST /api/sessions/register debe registrar correctamente a un usuario', async () => {
            const { _body, statusCode, ok } = await requester.post('/api/sessions/register').send(userMock)
            
            expect(_body).to.be.ok
            expect(_body.user).to.be.an('object')
            expect(statusCode).to.be.equal(200)
            expect(ok).to.be.true
        })

        it('Endpoint POST /api/sessions/login debe loguear correctamente a un usuario y devolver una cookie', async () => {
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

        it('Endpoint GET /api/sessions/current debe enviar la cookie que contiene el usuario y destructurar este correctamente', async () => {
            const { _body, statusCode, ok } = await requester.get('/api/sessions/current').set('cookie', [`${cookie.name}=${cookie.value}`])
            
            expect(_body.user.email).to.be.equal(userMock.email)
            expect(ok).to.be.true
            expect(statusCode).to.be.equal(200)
        })
    })

    describe('Test de Carts', () => {
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
            await mongoose.connection.collection('users').deleteMany({})
            await mongoose.connection.collection('carts').deleteMany({})
            await mongoose.connection.collection('products').deleteMany({})

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

        it('Endpoint POST /api/carts debe crear correctamente un carrito', async () => {
            const { _body, statusCode, ok } = await requester.post('/api/carts').set('cookie', `${cookie.name}=${cookie.value}`)
            
            expect(statusCode).to.be.equal(201)
            expect(ok).to.be.equal(true)
            expect(_body.cart).to.be.an('object')
            expect(_body.cart.products).to.be.an('array')
            expect(_body.cart).to.have.property('_id')
        })

        it('Endpoint GET /api/carts/cid debe traer un carrito correctamente', async () => {
            const result = await requester.post('/api/carts').set('cookie', `${cookie.name}=${cookie.value}`)
            const cid = result._body.cart._id

            expect(cid).to.be.an('string')

            const { _body } = await requester.get(`/api/carts/${cid}`).set('cookie', `${cookie.name}=${cookie.value}`)
            
            expect(cid).to.be.an('string')
            expect(_body.message).to.be.equal('El carrito no tiene productos')
        })
        
        it('Endpoint POST /api/carts/cid/product/pid debe agregar un producto a un carrito', async () => {
            const cart = await requester.post('/api/carts').set('cookie', `${cookie.name}=${cookie.value}`)
            const product = await requester.post('/api/products').set('cookie', `${cookie.name}=${cookie.value}`).send(productMock)
            const cid = cart._body.cart._id
            const pid = product._body.payload._id

            expect(cid).to.be.an('string')
            expect(pid).to.be.an('string')
            
            const updateResult = await mongoose.connection.collection('products').updateOne(
                { _id: new mongoose.Types.ObjectId(pid) },
                { $set: { owner: 'admin' } }
            );
            
            expect(updateResult.modifiedCount).to.be.equal(1)
            

            const { _body, ok, statusCode } = await requester.post(`/api/carts/${cid}/product/${pid}`).set('cookie', `${cookie.name}=${cookie.value}`)
            
            expect(ok).to.be.equal(true)
            expect(statusCode).to.be.equal(200)
            expect(_body.message).to.be.equal('Producto agregado al carrito')
            expect(_body.status).to.be.equal('success')
        })
        
        it('Endpoint DELETE /api/carts/cid/products/pid debe procesar correctamente la compra', async () => {
            const cart = await requester.post('/api/carts').set('cookie', `${cookie.name}=${cookie.value}`)
            const product = await requester.post('/api/products').set('cookie', `${cookie.name}=${cookie.value}`).send(productMock)
            const cid = cart._body.cart._id
            const pid = product._body.payload._id

            expect(cid).to.be.an('string')
            expect(pid).to.be.an('string')
            
            const updateResult = await mongoose.connection.collection('products').updateOne(
                { _id: new mongoose.Types.ObjectId(pid) },
                { $set: { owner: 'admin' } }
            );
            
            expect(updateResult.modifiedCount).to.be.equal(1)

            const cartResponse = await requester.post(`/api/carts/${cid}/product/${pid}`).set('cookie', `${cookie.name}=${cookie.value}`)
            expect(cartResponse._body.message).to.be.equal('Producto agregado al carrito')
            expect(cartResponse.statusCode).to.be.equal(200)

            const { _body, statusCode, ok } = await requester.delete(`/api/carts/${cid}/products/${pid}`).set('cookie', `${cookie.name}=${cookie.value}`)

            expect(ok).to.be.equal(true)
            expect(statusCode).to.be.equal(200)
            expect(_body.message).to.be.equal('Producto eliminado del carrito exitosamente')
        });
    })
})