import { Router } from "express";
import { uploader } from "../multer.js";

import productsRouter from "./API/productsRouter.js";
import cartsRouter from "./API/cartsRouter.js";
import viewsRouter from "./viewsRouter.js";
import usersRouter from "./API/usersRouter.js";
import { sessionsRouter } from './API/sessionsRouter.js'

const router = Router();

// Ruta para subir archivos
router.use('/subir-archivo', uploader.single('myFile') ,(req, res) => {
    if (!req.file) {
        return res.send('no se puede subir el archivo')        
    }
    
    res.send('archivo subido')
})

// Configuración de las rutas
router.use('/api/products', productsRouter);
router.use('/api/carts', cartsRouter);
router.use('/api/users', usersRouter);
router.use('/', viewsRouter);
router.use('/api/sessions', sessionsRouter)

// Manejo de errores del servidor
router.use((error, req, res, next) => {
    console.log(error)
    res.status(500).send('Error 500 en el server')
})

export default router