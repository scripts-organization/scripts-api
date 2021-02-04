
const getMenuFrontEnd = (role = 'USER_ROLE') => {

    const menu = [
        {
          titulo: 'Dashboard',
          icono: 'mdi mdi-gauge',
          submenu: [
            { titulo: 'Main', url: '/' },
            { titulo: 'Gráficas', url: 'grafica1' },
            { titulo: 'rxjs', url: 'rxjs' },
            { titulo: 'Promesas', url: 'promesas' },
            { titulo: 'ProgressBar', url: 'progress' },
          ]
        },
    
        {
          titulo: 'Mantenimientos',
          icono: 'mdi mdi-folder-lock-open',
          submenu: [
            // { titulo: 'Usuarios', url: 'usuarios' },
            // { titulo: 'Hospitales', url: 'hospitales' },
            // { titulo: 'Médicos', url: 'medicos' },
            //{ titulo: 'Recintos', url: 'recintos' },
            { titulo: 'Delegados', url: 'delegados' },
          ]
        },
      ];

    if ( role === 'ADMIN_ROLE' ) {
        menu[1].submenu.unshift(
          { titulo: 'Usuarios', url: 'usuarios' },
          { titulo: 'Recintos', url: 'recintos' },
          { titulo: 'Registro Jefes Recinto', url: 'jeferecinto' },


        )
    }

    return menu;
}

module.exports = {
    getMenuFrontEnd
}
