import { connect } from 'mongoose'

export const connectDb = () => {
    console.log('Base de datos conectada')
    connect("mongodb+srv://tomibesso:tomi2024@clusterecommercetomi.auhhpid.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=ClusterEcommerceTomi")
    
}