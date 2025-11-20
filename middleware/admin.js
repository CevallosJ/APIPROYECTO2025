module.exports = function (req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ ok: false, msg: "No autorizado" });
    }

    if (req.user.rol !== "admin") {
      return res.status(403).json({ ok: false, msg: "Solo administradores pueden realizar esta acción" });
    }

    next();
  } catch (err) {
    return res.status(500).json({ ok: false, msg: "Error de autenticación" });
  }
};
