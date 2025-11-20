const pool = require('../config/db');
const resp = require('../utils/responseHelper');

// Obtener preguntas por universidad
async function getByUniversity(req, res) {
  try {
    const { uniId } = req.params;
    const limit = parseInt(req.query.limite || '25');

    const [rows] = await pool.query(
      'SELECT * FROM preguntas WHERE uniId = ? AND activo = 1 LIMIT ?',
      [uniId, limit]
    );

    return resp.success(res, rows.map(p => ({
      id: p.id,
      texto: p.texto,
      area: p.area,
      correcta: p.correcta,
      opciones: JSON.parse(p.opciones)
    })));

  } catch (err) {
    return resp.error(res, "Error obteniendo preguntas");
  }
}

// Crear una pregunta
async function create(req, res) {
  try {
    const { uniId, texto, area, correcta, opciones } = req.body;

    await pool.query(
      `INSERT INTO preguntas (uniId, texto, area, correcta, opciones, activo, fechaCreacion)
       VALUES (?, ?, ?, ?, ?, 1, NOW())`,
      [uniId, texto, area, correcta, JSON.stringify(opciones)]
    );

    return resp.created(res, { message: "Pregunta creada" });

  } catch (err) {
    return resp.error(res, "Error creando pregunta");
  }
}

// Importar Excel
async function importBulk(req, res) {
  try {
    const { uniId } = req.params;
    const { preguntas } = req.body;

    if (!Array.isArray(preguntas)) 
      return resp.badRequest(res, "Formato inválido");

    let count = 0;

    for (const p of preguntas) {
      if (!p.texto) continue;

      // Convertir letra a índice si viene "A,B,C,D"
      if (typeof p.correcta === "string") {
        const letras = ["A", "B", "C", "D"];
        p.correcta = letras.indexOf(p.correcta.toUpperCase());
      }

      await pool.query(
        `INSERT INTO preguntas (uniId, texto, area, correcta, opciones, activo, fechaCreacion)
         VALUES (?, ?, ?, ?, ?, 1, NOW())`,
        [uniId, p.texto, p.area, p.correcta, JSON.stringify(p.opciones)]
      );

      count++;
    }

    return resp.created(res, { message: `${count} preguntas importadas` });

  } catch (err) {
    return resp.error(res, "Error importando preguntas");
  }
}

// 🔥 ACTUALIZAR
async function update(req, res) {
  try {
    const { id } = req.params;
    const { texto, area, correcta, opciones } = req.body;

    await pool.query(
      `UPDATE preguntas 
       SET texto=?, area=?, correcta=?, opciones=?, fechaActualizacion=NOW() 
       WHERE id=?`,
      [texto, area, correcta, JSON.stringify(opciones), id]
    );

    return resp.success(res, { message: "Pregunta actualizada" });

  } catch (err) {
    return resp.error(res, "Error actualizando");
  }
}

// 🔥 ELIMINAR
async function remove(req, res) {
  try {
    const { id } = req.params;

    await pool.query(`UPDATE preguntas SET activo = 0 WHERE id = ?`, [id]);

    return resp.success(res, { message: "Pregunta eliminada" });

  } catch (err) {
    return resp.error(res, "Error eliminando");
  }
}

// === EXPORTAR TODO ===
module.exports = {
  getByUniversity,
  create,
  importBulk,
  update,
  remove
};
