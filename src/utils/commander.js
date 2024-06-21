import { Command } from "commander";

export const program = new Command();

program
    .option('-d, --debug', 'Variable para debug', false)
    .option('-p, --port <port>', 'Puerto del servidor', 8080)
    .option('-m, --mode <mode>', 'Modo de trabajo para mi servidor', 'production')
    .option('-u, --user <user>', 'Usuario utulizando aplicativo', 'No se ha declarado usuario')
    .option('-l, --letters [letters...]', 'Especificar letras')
    .parse();