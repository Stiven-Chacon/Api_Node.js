const express = require('express')
const oracledb = require('oracledb');
const app = express();
const port =  8001;

var password = process.env.DB_PASSWORD ||'1234';
var user = process.env.DB_USER || "api";

let connection; 

async function consultaCuentas(req, res) {
    try {
        connection = await oracledb.getConnection({
            user: user,
            password: password,
            connectString: "localhost",
        });
        console.log('Conectado a la base de datos');
        const result = await connection.execute('SELECT * FROM cuenta');
        console.log("resultado de la consulta", result);

        if (!result || !result.rows || result.rows.length === 0) {
            return res.send('No se encontraron resultados');
        } else {
            return res.send(result.rows);
        }
    } catch (err) {
        console.error("error del cath",err.message);
        return res.status(500).send(err.message);
  } finally {
     if (connection) {
         try {
             await connection.close();
             console.log('Conexión cerrada exitosamente');
         } catch (err) {
             console.error("error del finally",err.message);
         }
     } 
    }
}
app.get('/', (req, res) => {
    res.status(200).send("Api NODE.JS")
  })

app.get('/cuentas', function (req, res) {
    consultaCuentas(req, res);
});

app.listen(port, () => {
    console.log(`El servidor está en http://localhost:${port}`);
});
