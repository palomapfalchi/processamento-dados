
//importar biblioteca mysql2
const mysql = require("mysql2");
const { connected } = require("process");

//criando conexao com base de dados
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "mysql",
    database: "employees"
}); 

//callback informando se teve erro a conexão com a base de dados
connection.connect( (err)=> {
    if (err) {
        throw err;
    } else {
        console.log("Conectado!");
    }
});

//funcao que atualiza dados do empregado
const processRow = (row, callback) => {
    console.log(row);
    callback();
}

//buscar dados dos empregados
var query = connection.query("SELECT emp_no, first_name, last_name FROM employees.employees LIMIT 10");

query.on("error", () => {
    console.error(err);
}) //buffer
.on("result", (row) => {
    //pausa busca de dados
    connection.pause();
    
    processRow(row, () => {
        //retoma busca de dados
        connection.resume();
    });

})
.on("end", () => {
    console.log("Sucesso!");
    connection.end();
});