const pool = require('../config/db');
const resp = require('../utils/responseHelper');

async function getAll(req, res) {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM universidades WHERE activo = 1 ORDER BY nombre'
    );

    const universidades = rows.map(u => {
      let tipos = [];
      try {
        tipos = u.Tipodeprueba ? JSON.parse(u.Tipodeprueba) : [];
      } catch {
        tipos = [];
      }

      return {
        ...u,
        Tipodeprueba: tipos
      };
    });

    return resp.success(res, universidades);

  } catch (err) {
    console.error(err);
    return resp.error(res, 'Error al obtener universidades');
  }
}

async function create(req, res) {
  try {
    const { nombre, porcExamen, porcGrado, modalidad, Tipodeprueba } = req.body;

    if (!nombre) {
      return resp.badRequest(res, 'El nombre es obligatorio');
    }

    const [r] = await pool.query(
      `INSERT INTO universidades 
      (nombre, porcExamen, porcGrado, modalidad, Tipodeprueba, activo, fechaCreacion)
       VALUES (?, ?, ?, ?, ?, 1, NOW())`,
      [
        nombre,
        porcExamen || 50,
        porcGrado || 50,
        modalidad || null,
        JSON.stringify(Tipodeprueba || [])
      ]
    );

    return resp.created(res, { id: r.insertId, message: "Universidad creada correctamente" });

  } catch (err) {
    console.error(err);
    return resp.error(res, "Error al crear universidad");
  }
}

async function update(req, res) {
  try {
    const { id } = req.params;
    const { nombre, porcExamen, porcGrado, modalidad, Tipodeprueba } = req.body;

    const [exists] = await pool.query(
      'SELECT id FROM universidades WHERE id = ? AND activo = 1',
      [id]
    );

    if (!exists.length) return resp.notFound(res, 'Universidad no encontrada');

    await pool.query(
      `UPDATE universidades SET 
        nombre = ?, 
        porcExamen = ?, 
        porcGrado = ?,
        modalidad = ?,
        Tipodeprueba = ?
      WHERE id = ?`,
      [
        nombre,
        porcExamen,
        porcGrado,
        modalidad || null,
        JSON.stringify(Tipodeprueba || []),
        id
      ]
    );

    return resp.success(res, { message: "Universidad actualizada" });

  } catch (err) {
    console.error(err);
    return resp.error(res, "Error al actualizar universidad");
  }
}

async function remove(req, res) {
  try {
    const { id } = req.params;
    await pool.query('UPDATE universidades SET activo = 0 WHERE id = ?', [id]);
    return resp.success(res, { message: 'Universidad eliminada' });
  } catch (err) {
    console.error(err);
    return resp.error(res, "Error al eliminar universidad");
  }
}

module.exports = { getAll, create, update, remove };
