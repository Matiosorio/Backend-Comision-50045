const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === "admin") {
        next();
    } else {
        res.status(403).json({ error: "Acceso no autorizado" });
    }
};

const isUser = (req, res, next) => {
    if (req.session.user && req.session.user.role === "user") {
        next();
    } else {
        res.status(403).json({ error: "Acceso no autorizado" });
    }
};

module.exports = { isAdmin, isUser };