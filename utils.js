import { fileURLToPath } from "url"; // Importa la función fileURLToPath de la biblioteca url
import { dirname } from "path"; // Importa la función dirname de la biblioteca path

const __filename = fileURLToPath(import.meta.url); // Obtiene la ruta de archivo del módulo actual
export const __dirname = dirname(__filename); // Obtiene el nombre del directorio del archivo actual
