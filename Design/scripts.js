document.addEventListener('DOMContentLoaded', function() {
    // Código JavaScript que se ejecuta cuando el DOM está completamente cargado

    // Ejemplo: Manejar clics en las aplicaciones
    const apps = document.querySelectorAll('.o_app');
    apps.forEach(app => {
        app.addEventListener('click', function(event) {
            event.preventDefault();
            const appName = this.querySelector('.o_caption').textContent;
            alert(`Has seleccionado la aplicación: ${appName}`);
        });
    });

    // Ejemplo: Manejar la alerta de expiración de la base de datos
    const alertPanel = document.querySelector('.database_expiration_panel');
    if (alertPanel) {
        alertPanel.addEventListener('click', function() {
            alert('Tu prueba gratis está a punto de expirar. ¡Regístrate o compra una suscripción!');
        });
    }
});