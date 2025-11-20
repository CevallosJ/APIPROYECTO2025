const pool = require('../config/db');
const resp = require('../utils/responseHelper');

async function calcularPuntaje(req, res) {
  try {
    const { universidadId, notaExamen, notaGrado } = req.body;
    if (!universidadId || notaExamen === undefined || notaGrado === undefined) return resp.badRequest(res,'Campos requeridos');
    const [rows] = await pool.query('SELECT porcExamen, porcGrado FROM universidades WHERE id = ? AND Activo = 1', [universidadId]);
    if (!rows.length) return resp.notFound(res,'Universidad no encontrada');
    const { porcExamen, porcGrado } = rows[0];
    const puntajeExamen = (notaExamen * porcExamen) / 100;
    const puntajeGrado = (notaGrado * porcGrado) / 10; // grado sobre 10 -> convertir
    const puntajeFinal = Math.round(puntajeExamen + puntajeGrado);
    return resp.success(res, { puntajeFinal, detalles: { notaExamen, notaGrado, porcExamen, porcGrado, puntajeExamen: Math.round(puntajeExamen), puntajeGrado: Math.round(puntajeGrado) } });
  } catch (err) {
    console.error(err);
    return resp.error(res,'Error al calcular puntaje');
  }
}

module.exports = { calcularPuntaje };