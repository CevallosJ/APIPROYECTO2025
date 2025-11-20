require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const universidadesRoutes = require('./routes/universidades.routes');
const carrerasRoutes = require('./routes/carreras.routes');
const preguntasRoutes = require('./routes/preguntas.routes');
const simuladorRoutes = require('./routes/simulador.routes');
const calculosRoutes = require('./routes/calculos.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.json({ ok: true, msg: 'API Proyecto Alfa' }));

app.use('/api/auth', authRoutes);
app.use('/api/universidades', universidadesRoutes);
app.use('/api/carreras', carrerasRoutes);
app.use('/api/preguntas', preguntasRoutes);
app.use('/api/simulador', simuladorRoutes);
app.use('/api/calculos', calculosRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('API conectada en puerto', PORT));