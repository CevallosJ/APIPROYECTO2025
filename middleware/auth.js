const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'secret_dev';

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ ok:false, msg:'No token' });
  const parts = auth.split(' ');
  if (parts.length !== 2) return res.status(401).json({ ok:false, msg:'Token mal formado' });
  const token = parts[1];
  try {
    const payload = jwt.verify(token, secret);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ ok:false, msg:'Token inválido' });
  }
}

module.exports = authMiddleware;