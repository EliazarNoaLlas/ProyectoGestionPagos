/* Estilos generales */
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f4f4f4;
}

.o_navbar {
    background-color: #714B67;
    color: white;
    padding: 10px;
}

.o_main_navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.o_menu_toggle {
    color: white;
    text-decoration: none;
}

.o_menu_systray {
    display: flex;
    gap: 10px;
}

.o_action_manager {
    padding: 20px;
}

.o_home_menu {
    background-color: white;
    border-radius: 8px;
    padding: 20px;
}

.o_apps {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
}

.o_app {
    text-align: center;
    text-decoration: none;
    color: inherit;
}

.o_app_icon {
    width: 50px;
    height: 50px;
    border-radius: 8px;
}

.o_caption {
    margin-top: 10px;
}

/* Estilos específicos para la alerta */
.database_expiration_panel {
    background-color: #fff3cd;
    border-color: #ffeeba;
    color: #856404;
    padding: 10px;
    border-radius: 4px;
    margin-bottom: 20px;
}