const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

const app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection(
    {
        host:'localhost',
        user:'root',
        password:'',
        database:'auth'
    }
);

db.connect(err=>{
    if (err) {
        console.log('Error de conexion a la base de datos: '+err);
    }else{
        console.log('Conexion exitosa a la base de datos');
    }
})

app.post('/api/register',(req,res)=>{
    const {nombre,email,contrasena} = req.body;
    const queryUsuarios = 'SELECT * FROM usuarios WHERE email = ?';
    db.query(queryUsuarios,[email],(err,results)=>{
        if (err) {
            console.log('Error en el registro: '+err);
            res.status(500).send('Error en el servidor');
        }else if(results.length > 0){
            res.json({status:1, message:'El email ya existe, por favor, use otro'});
        }else{
            const insercion = "INSERT INTO usuarios (nombre,email,contrasena) VALUES (?,?,?)";
            db.query(insercion,[nombre,email,contrasena],(err)=>{
                if (err) {
                    console.log('Error en el registro: '+err);
                    res.status(500).send('Error en el servidor');  
                }else{
                    res.json({status:2, message:'El registro se ha completado saisfactoriamente'});
                }
            })
        }
    })
});


app.post('/api/login',(req,res)=>{
    const {email,contrasena} = req.body;
    const query = 'SELECT * FROM usuarios WHERE email = ? AND contrasena = ?'

    db.query(query,[email,contrasena],(err,results)=>{
        if (err) {
            console.log('Error en la consulta: '+err);
            res.status(500).send('Error en el server');
        }else if (results.length < 1) {
            res.status(401).send('Email o contraseña incorrecto')
        }else{
            res.json({message:'Inicio de sesión exitoso',usuario: results[0]})
        }
    })


})










app.listen(3000,()=>{
    console.log('Servidor de express funcionando');
})