const pool = require('../config/db');
const resp = require('../utils/responseHelper');

async function saveIntento(req, res) {
  try {
    const { universidadId, correctas, incorrectas, total, tiempoSegundos } = req.body;
    const userId = req.user && req.user.userId ? req.user.userId : null;
    if (!universidadId || correctas === undefined || incorrectas === undefined || total === undefined) return resp.badRequest(res,'Campos requeridos');
    const puntaje = Math.round((correctas / total) * 1000);
    const [r] = await pool.query('INSERT INTO intentossimulador (userId, universidadId, correctas, incorrectas, total, puntaje, tiempoSegundos, Fecha) VALUES (?,?,?,?,?,?,?,NOW())', [userId, universidadId, correctas, incorrectas, total, puntaje, tiempoSegundos||null]);
    return resp.created(res, { intentoId: r.insertId, puntaje });
  } catch (err) {
    console.error(err);
    return resp.error(res,'Error al guardar intento');
  }
}

async function getHistorial(req, res) {
  try {
    const uniId = req.params.uniId;
    const userId = req.user && req.user.userId ? req.user.userId : null;
    const [rows] = await pool.query('SELECT id as intentoId, correctas, incorrectas, total, puntaje, Fecha, tiempoSegundos FROM intentossimulador WHERE universidadId = ? AND userId = ? ORDER BY Fecha DESC', [uniId, userId]);
    return resp.success(res, rows);
  } catch (err) {
    console.error(err);
    return resp.error(res,'Error al obtener historial');
  }
}

async function getHistorialAdmin(req, res) {
  try {
    const uniId = req.params.uniId;
    const [rows] = await pool.query(`SELECT i.id as intentoId, u.Nombre as nombreUsuario, u.Email as email, i.correctas, i.incorrectas, i.total, i.puntaje, i.Fecha, i.tiempoSegundos FROM intentossimulador i LEFT JOIN usuarios u ON i.userId = u.UsuarioID WHERE i.universidadId = ? ORDER BY i.Fecha DESC`, [uniId]);
    return resp.success(res, rows);
  } catch (err) {
    console.error(err);
    return resp.error(res,'Error al obtener historial admin');
  }
}

module.exports = { saveIntento, getHistorial, getHistorialAdmin };