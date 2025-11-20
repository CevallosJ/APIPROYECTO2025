function success(res, data) { return res.json({ ok: true, data }); }
function created(res, data) { return res.status(201).json({ ok: true, data }); }
function error(res, msg='Error interno') { return res.status(500).json({ ok:false, msg }); }
function badRequest(res, msg) { return res.status(400).json({ ok:false, msg }); }
function notFound(res, msg) { return res.status(404).json({ ok:false, msg }); }

module.exports = { success, created, error, badRequest, notFound };