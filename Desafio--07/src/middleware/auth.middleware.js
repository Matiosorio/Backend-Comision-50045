const authMiddleware = (req, res, next) => {
    if (req.isAuthenticated()) {
        // Si el usuario está autenticado, adjuntar la información del usuario a la solicitud
        req.user = req.session.user;
        next(); // Continuar con la siguiente función de middleware
    } else {
        // Si el usuario no está autenticado, redirigir al inicio de sesión
        res.redirect("/login");
    }
};

module.exports = authMiddleware;
  