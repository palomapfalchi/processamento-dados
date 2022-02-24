//MÉTODO USANDO STREAM PIPE


//importar biblioteca mysql2
const mysql = require("mysql2");
const stream = require("stream");

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

//criacao de stream
var updateStream = new stream.Transform({highWaterMark: 5, objectMode: true});

//CONFIGURANDO FUNÇÃO DE ESCRITA
//chunk = linha, encoding = codificacao
updateStream._write = (chunk, encoding, callback) => {

    var sql = mysql.format('UPDATE employees SET full_name = CONCAT(?, " ", ?) WHERE emp_no = ?', [chunk['first_name'], chunk['last_name'], chunk['emp_no']]);
    connection.query(sql);
    
    callback();
}


//buscar dados dos empregados
var query = connection.query("SELECT emp_no, first_name, last_name FROM employees.employees LIMIT 350")
.on("end", ()=> {
    console.log("Sucesso!");
    connection.end();
});
//tamanho do buffer: 5
//pipe: stream

//stream de leitura e depois de escrita (pipe)
query.stream({highWaterMark: 5}).pipe(updateStream);