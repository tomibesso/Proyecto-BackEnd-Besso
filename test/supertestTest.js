import chai from 'chai'
import supertest from 'supertest'

// Debemos tener (en otra terminal) nuestro servidor levantado para poder ejecutar los endpoints

const expect = chai.expect
const requester = supertest('http://localhost:8080')

describe('Test del Proyecto BackEnd', () => {
    describe('Test de Producto', () => {
        it('Endpoint POST /api/products debe crear un producto correctamente', async () => {
            const productMock = {
                title: 'Producto Test',
                description: 'Descripcion Test',
                price: 200,
                thumbnails: 'Thumbnails Test',
                code: 'Codigo Test',
                stock: 25,
                category: 'Categoria Test',
                owner: 'Owner Test'
            }

            const { statusCode, ok, _body } = await requester.post('/api/products').send(productMock)

            // console.log(statusCode);
            // console.log(ok);
            // console.log(_body);
            expect(_body.payload).to.have.property('_id')
        })

        it('Endpoint GET /api/products debe traer todos los productos correctamente', async () => {
            const {statusCode, ok, _body } = await requester.get('/api/products')

            expect(ok).to.be.equal(true)
            expect(statusCode).to.be.equal(200)
        })

        it('Endpoint GET /api/products debe traer un producto correctamente', async () => {
            const pid = '6632ffe6ab79238ec43cb1c4'

            const {statusCode, ok, _body } = await requester.get(`/api/products:${pid}`)

            expect(ok).to.be.equal(true)
            expect(statusCode).to.be.equal(200)
            expect(_body.payload).to.have.property('_id')
        })

        
    })

    describe('Test avanzado de Session', () => {
        let cookie
        it('Debe registrar correctamente a un usuario', async () => {
            const userMock = {
                firstName: 'Tomas',
                lastName: 'Besso',
                age: '24',
                email: 'tomi.besso12@gmail.com',
                password: '123456'
            }

            const { _body } = await requester.post('/api/sessions/register').send(userMock)
            expect(_body.payload).to.be.ok
        })

        it('Debe loguear correctamente a un usuario y devolver una cookie', async () => {
            const userMock = {
                email: 'tomi.besso12@gmail.com',
                password: '123456'
            }

            const result = await requester.post('/api/sessions/login').send(userMock)
            const cookieResult = result.headers['set-cookie'][0]

            expect(cookieResult).to.be.ok

            cookie = {
                name: cookieResult.split('=')[0],
                value: cookieResult.split('=')[1]
            }
            
            expect(cookie.name).to.be.ok.and.equal('TomiCookieToken')
            expect(cookie.value).to.be.ok
        })

        it('Debe enviar la cookie que contiene el usuario y destructurar este correctamente', async () => {
            const { _body } = await requester.get('/api/sessions/current').set('cookie', [`${cookie.name}=${cookie.value}`])
            
            expect(_body.payload.email).to.be.equal(userMock.email)
        })
    })

    describe('Test de Uploads', () => {
        it('El servicio debe crear un producto con la ruta de imagen', async () => {
            const productMock = {
                title: 'Producto Test',
                description: 'Descripcion Test',
                price: 200,
                thumbnails: 'Thumbnail Test',
                code: 'Codigo Test',
                stock: 25,
                category: 'Categoria Test',
                owner: 'Owner Test'
            }

            const result = await requester.post('/api/product/withImage')
                                        .field('name', productMock.title)
                                        .field('name', productMock.description)
                                        .field('name', productMock.price)
                                        .field('name', productMock.thumbnails)
                                        .field('name', productMock.code)
                                        .field('name', productMock.stock)
                                        .field('name', productMock.category)
                                        .field('name', productMock.owner)
                                        .attach('image', './src/public/assets/monumental-wallpaper.jpg')

            expect(result.statusCode).to.be.equal(200)
            expect(result._body.payload).to.have.property('_id')
            expect(result._body.payload.image).to.be.ok
        })
    })
})