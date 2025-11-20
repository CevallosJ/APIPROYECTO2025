const pool = require('../config/db');
const resp = require('../utils/responseHelper');

// ========== GET ALL ==========
async function getAll(req, res) {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM carreras WHERE activo = 1 ORDER BY nombre'
    );
    return resp.success(res, rows);
  } catch (err) {
    console.error(err);
    return resp.error(res, 'Error al obtener carreras');
  }
}

// ========== GET BY UNIVERSITY ==========
async function getByUniversity(req, res) {
  try {
    const { uniId } = req.params;
    const [rows] = await pool.query(
      'SELECT * FROM carreras WHERE uniId = ? AND activo = 1 ORDER BY nombre',
      [uniId]
    );
    return resp.success(res, rows);
  } catch (err) {
    console.error(err);
    return resp.error(res, 'Error al obtener carreras por universidad');
  }
}

// ========== CREATE ==========
async function create(req, res) {
  try {
    const { uniId, nombre, modalidad, matriz } = req.body;

    if (!uniId || !nombre || !modalidad)
      return resp.badRequest(res, 'Campos requeridos');

    const [result] = await pool.query(
      `INSERT INTO carreras (uniId, nombre, modalidad, matriz, activo, fechaCreacion)
       VALUES (?,?,?,?,1,NOW())`,
      [uniId, nombre, modalidad, matriz || null]
    );

    return resp.created(res, { id: result.insertId });
  } catch (err) {
    console.error(err);
    return resp.error(res, 'Error al crear carrera');
  }
}

// ========== UPDATE ==========
async function update(req, res) {
  try {
    const { id } = req.params;
    const { nombre, modalidad, matriz } = req.body;

    if (!id) return resp.badRequest(res, "ID requerido");
    if (!nombre || !modalidad)
      return resp.badRequest(res, "Campos requeridos");

    const [existe] = await pool.query(
      "SELECT id FROM carreras WHERE id = ? AND activo = 1",
      [id]
    );

    if (!existe.length)
      return resp.notFound(res, "Carrera no encontrada");

    await pool.query(
      `UPDATE carreras SET 
        nombre = ?, 
        modalidad = ?, 
        matriz = ?, 
        fechaActualizacion = NOW()
       WHERE id = ?`,
      [nombre, modalidad, matriz || null, id]
    );

    return resp.success(res, { message: "Carrera actualizada correctamente" });

  } catch (err) {
    console.error("❌ Error en UPDATE:", err);
    return resp.error(res, "Error al actualizar carrera");
  }
}

// ========== DELETE (SOFT) ==========
async function remove(req, res) {
  try {
    const { id } = req.params;
    await pool.query('UPDATE carreras SET activo = 0 WHERE id = ?', [id]);
    return resp.success(res, { message: "Carrera eliminada correctamente" });
  } catch (err) {
    console.error(err);
    return resp.error(res, 'Error al eliminar carrera');
  }
}

module.exports = {
  getAll,
  getByUniversity,
  create,
  update,
  remove
};
