import cluster from 'cluster';
import { cpus } from 'node:os';
import { getServer } from './src/app.js';

const numeroDeProcesadores = cpus().length

if (cluster.isPrimary) {
    console.log('Proceso primario, generando un proceso hijo...');
    for (let i = 0; i < numeroDeProcesadores; i++) {
        cluster.fork()
    }
    cluster.on('Message: ', worker => {
        console.log(`Worker ${worker.process.pid} recibio un mensaje`);
    })
} else {
    console.log('Al ser un proceso forkeado, no cuento como primario, por lo tanto, isPrimary es false. Soy un worker');
    console.log(`Soy un proceso hijo con el id: ${process.pid}`);
    getServer()
}