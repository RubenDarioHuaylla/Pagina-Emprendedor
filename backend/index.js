const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
    res.send('Backend funcionando');
});
app.listen(3005, () => {
console.log('Servidor escuchado en http://localhost:3005');
});