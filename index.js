
//METODO UTILIZANDO STREAM PAUSE/RESUME

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

// TESTA CONEXÃO - callback informando se teve erro a conexão com a base de dados
connection.connect( (err)=> {
    if (err) {
        throw err;
    } else {
        console.log("Conectado!");
    }
});

//funcao que atualiza dados do empregado
const processRow = (row, callback) => {
    
    var sql = mysql.format('UPDATE employees SET full_name = CONCAT(?, " ", ?) WHERE emp_no = ?', [row['first_name'], row['last_name'], row['emp_no']]);
    connection.query(sql);

    callback();
}

//buscar dados dos empregados
var query = connection.query("SELECT emp_no, first_name, last_name FROM employees.employees LIMIT 100");

// a cada linha buscada, para a conexão e processa(atualiza) a linha
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

}) //finalizando
.on("end", () => {
    console.log("Sucesso!");
    connection.end();
});