const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'secret_dev';

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ ok:false, msg:'email y password requeridos' });
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE Email = ? AND Activo = 1 LIMIT 1', [email]);
    if (rows.length === 0) return res.status(400).json({ ok:false, msg:'Usuario no encontrado' });
    const user = rows[0];
    const valid = await bcrypt.compare(password, user.Password);
    if (!valid) return res.status(400).json({ ok:false, msg:'Contraseña incorrecta' });
    const token = jwt.sign({ userId: user.UsuarioID, rol: user.Rol }, secret, { expiresIn: '7d' });
    res.json({ ok:true, token, usuario: { id: user.UsuarioID, nombre: user.Nombre, email: user.Email, rol: user.Rol } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok:false, msg:'Error en login' });
  }
}

async function register(req, res) {
  try {
    const { nombre, email, password } = req.body;
    if (!nombre || !email || !password) return res.status(400).json({ ok:false, msg:'Campos requeridos' });
    const [exists] = await pool.query('SELECT * FROM usuarios WHERE Email = ? LIMIT 1', [email]);
    if (exists.length) return res.status(400).json({ ok:false, msg:'Email ya registrado' });
    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query('INSERT INTO usuarios (Nombre, Email, Password, Rol, FechaCreacion, Activo) VALUES (?,?,?,?,NOW(),1)', [nombre, email, hash, 'estudiante']);
    res.status(201).json({ ok:true, msg:'Usuario creado', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok:false, msg:'Error al registrar' });
  }
}

module.exports = { login, register };