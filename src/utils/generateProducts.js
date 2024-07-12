import { faker } from '@faker-js/faker';

export const generateProducts = () => {
    return {
        _id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        code: faker.string.alphanumeric({length: 15}),
        stock: faker.number.int({max: 100}),
        category: faker.commerce.department()
    }
}