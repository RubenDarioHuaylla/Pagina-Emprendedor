JavaScript
 // archivo: hash.js 
const bcrypt = require('bcrypt'); 
const passwordPlano = '123456'; 
const saltRounds = 10; 
bcrypt.hash(passwordPlano, saltRounds, (err, hash) => { 
if (err) throw err; 
console.log('Contraseña cifrada:', hash); 
});