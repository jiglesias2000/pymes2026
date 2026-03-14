const sequelize = require('./configurarSequelize');
const categorias = require('./categoriasModel');
const articulos = require('./articulosModel');
const usuarios = require('./usuariosModel');
const clientes = require('./clientesModel');
const ventascabecera = require('./ventasCabeceraModel');
const ventasdetalle = require('./ventasDetalleModel');

if (require.main === module) {
  inicializarBase();    // si se ejecuta este archivo directamente, inicializa la base de datos, si no se lo ejecutara antes de levantar el servidor
}


 async function inicializarBase() {
  try {

    if (process.env.DB_DIALECT === 'postgres') {
      // Para PostgreSQL, verificar si las tablas ya tienen datos
      try {
        const count = await categorias.count();
        if (count > 0) return; // ya inicializada
      } catch (e) {
        // tabla no existe, continuar con inicialización
      }
    } else {
      // Para SQLite, verificar si el archivo existe
      const fs = require('fs');
      const path = require('path');
      const archivo = path.join(__dirname, '.././data/pymes.db');
      if (fs.existsSync(archivo)) {
        return;   // si existe lo deja tal cual
      }
    }

    // Sincroniza los modelos con la base de datos
    await sequelize.sync({ force: true }); // `force: true` elimina las tablas existentes y las vuelve a crear (¡cuidado en producción!)

    // Crea datos de prueba
    await DatosCategorias();
    await DatosArticulos();
    await DatosUsuarios();
    await DatosClientes();
    await DatosVentas();

    console.log('Base de datos inicializada y datos de prueba creados.');

  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
  }
}


async function DatosArticulos() {
  await articulos.bulkCreate([
    { ArticuloId: 1, Nombre: 'KIT DIRECT TV PREPA 0.60MT', Precio: 299.00, CodigoDeBarra: '0779815559001', IdCategoria: 10, Stock: 329, FechaAlta: '2017-01-19', Activo: true },
    { ArticuloId: 2, Nombre: 'KIT DIRECT TV PREPA 0.90MT', Precio: 349.00, CodigoDeBarra: '0779815559002', IdCategoria: 10, Stock: 468, FechaAlta: '2017-01-31', Activo: true },
    { ArticuloId: 3, Nombre: 'LED 22" LG FHD 22MN42APM', Precio: 2669.00, CodigoDeBarra: '0779808338808', IdCategoria: 10, Stock: 536, FechaAlta: '2017-01-12', Activo: true },
    { ArticuloId: 4, Nombre: 'LED 24" ILO HD DIGITAL MOD LDH24ILO02', Precio: 2999.00, CodigoDeBarra: '0779696260024', IdCategoria: 10, Stock: 169, FechaAlta: '2017-01-30', Activo: true },
    { ArticuloId: 5, Nombre: 'LED 24" LG HD 24MN42A-PM', Precio: 3129.00, CodigoDeBarra: '0779808338809', IdCategoria: 10, Stock: 296, FechaAlta: '2016-12-28', Activo: true },
    { ArticuloId: 7, Nombre: 'LED 32" BGH HD BLE3214D', Precio: 4830.00, CodigoDeBarra: '0779688540133', IdCategoria: 10, Stock: 998, FechaAlta: '2017-01-01', Activo: true },
    { ArticuloId: 8, Nombre: 'LED 32" BGH SMART TV BLE3213RT', Precio: 5405.00, CodigoDeBarra: '0779688540117', IdCategoria: 10, Stock: 650, FechaAlta: '2017-01-18', Activo: true },
    { ArticuloId: 9, Nombre: 'LED 32" HISENSE IPTV HLE3213RT', Precio: 5290.00, CodigoDeBarra: '0779688540119', IdCategoria: 10, Stock: 51, FechaAlta: '2017-02-03', Activo: true },
    { ArticuloId: 10, Nombre: 'LED 32" HITACHI HD CDHLE32FD10', Precio: 4837.00, CodigoDeBarra: '0779694109973', IdCategoria: 10, Stock: 838, FechaAlta: '2016-12-25', Activo: true },
    { ArticuloId: 11, Nombre: 'LED 32" ILO HD DIGITAL LDH32ILO02', Precio: 4199.00, CodigoDeBarra: '0779696260132', IdCategoria: 10, Stock: 501, FechaAlta: '2017-01-25', Activo: true },
    { ArticuloId: 12, Nombre: 'LED 32" JVC HD IPTV LT32DR930', Precio: 6699.00, CodigoDeBarra: '0779818058057', IdCategoria: 10, Stock: 906, FechaAlta: '2017-01-25', Activo: true },
    { ArticuloId: 13, Nombre: 'LED 32" JVC HD LT32DA330', Precio: 4499.00, CodigoDeBarra: '0779696266323', IdCategoria: 10, Stock: 435, FechaAlta: '2017-02-07', Activo: true },
    { ArticuloId: 14, Nombre: 'LED 32" LG 3D 32LA613B', Precio: 6299.00, CodigoDeBarra: '0779808338816', IdCategoria: 10, Stock: 329, FechaAlta: '2017-02-06', Activo: true },
    { ArticuloId: 15, Nombre: 'LED 32" PHILIPS FHD 32PFL3018D/77', Precio: 6799.00, CodigoDeBarra: '0871258168715', IdCategoria: 10, Stock: 971, FechaAlta: '2016-12-25', Activo: true },
    { ArticuloId: 16, Nombre: 'LED 32" PHILIPS FHD IPTV 32PFL4508G/77', Precio: 7699.00, CodigoDeBarra: '0871258167198', IdCategoria: 10, Stock: 636, FechaAlta: '2017-02-07', Activo: true },
    { ArticuloId: 17, Nombre: 'LED 32" PHILIPS HD 32PFL3008D/77', Precio: 5799.00, CodigoDeBarra: '0871258167218', IdCategoria: 10, Stock: 67, FechaAlta: '2016-12-27', Activo: true },
    { ArticuloId: 18, Nombre: 'LED 32" PHILIPS SMART TV 32PFL3518G/77', Precio: 7399.00, CodigoDeBarra: '0871258167225', IdCategoria: 10, Stock: 250, FechaAlta: '2017-01-08', Activo: true },
    { ArticuloId: 19, Nombre: 'LED 32" RCA HD L32S80DIGI', Precio: 4499.00, CodigoDeBarra: '0779694101214', IdCategoria: 10, Stock: 857, FechaAlta: '2017-01-23', Activo: true },
    { ArticuloId: 20, Nombre: 'LED 32" SAMSUNG FHD UN32F5000', Precio: 6094.00, CodigoDeBarra: '0880608543154', IdCategoria: 10, Stock: 636, FechaAlta: '2016-12-30', Activo: true },
    { ArticuloId: 21, Nombre: 'LED 32" SAMSUNG HD UN32F4000', Precio: 5519.00, CodigoDeBarra: '0880608543153', IdCategoria: 10, Stock: 37, FechaAlta: '2017-01-23', Activo: true },
    { ArticuloId: 22, Nombre: 'LED 32" SAMSUNG SMART UN32F5500', Precio: 6899.00, CodigoDeBarra: '0880608548607', IdCategoria: 10, Stock: 214, FechaAlta: '2017-01-24', Activo: true },
    { ArticuloId: 23, Nombre: 'LED 32" SONY HD KDL32R425', Precio: 6199.00, CodigoDeBarra: '0490552491740', IdCategoria: 10, Stock: 642, FechaAlta: '2017-01-17', Activo: true },
    { ArticuloId: 24, Nombre: 'LED 32" SONY SMART TV KDL32W655', Precio: 6999.00, CodigoDeBarra: '0490552491687', IdCategoria: 10, Stock: 50, FechaAlta: '2017-02-04', Activo: true },
    { ArticuloId: 25, Nombre: 'LED 39" ILO DIG FHD LDF39ILO2', Precio: 5699.00, CodigoDeBarra: '0779696260394', IdCategoria: 10, Stock: 951, FechaAlta: '2017-01-19', Activo: true },
    { ArticuloId: 26, Nombre: 'LED 39" PHILIPS FHD IPTV 39PFL3508G/77', Precio: 8799.00, CodigoDeBarra: '0871258168717', IdCategoria: 10, Stock: 889, FechaAlta: '2017-02-03', Activo: true },
    { ArticuloId: 27, Nombre: 'LED 39" RCA FHD L39S85DIGIFHD', Precio: 6499.00, CodigoDeBarra: '0779694101215', IdCategoria: 10, Stock: 487, FechaAlta: '2016-12-25', Activo: true },
    { ArticuloId: 28, Nombre: 'LED 40" BGH FHD BLE4014D', Precio: 7245.00, CodigoDeBarra: '0779688540132', IdCategoria: 10, Stock: 480, FechaAlta: '2016-12-27', Activo: true },
    { ArticuloId: 29, Nombre: 'LED 40" SAMSUNG 3D SMART UN40F6800', Precio: 13224.00, CodigoDeBarra: '0880608565606', IdCategoria: 10, Stock: 734, FechaAlta: '2017-01-26', Activo: true },
    { ArticuloId: 30, Nombre: 'LED 40" SAMSUNG 3D UN40F6100', Precio: 9999.00, CodigoDeBarra: '0880608544958', IdCategoria: 10, Stock: 835, FechaAlta: '2017-01-19', Activo: true },
    { ArticuloId: 31, Nombre: 'LED 40" SAMSUNG FHD UN40F5000', Precio: 8164.00, CodigoDeBarra: '0880608543156', IdCategoria: 10, Stock: 436, FechaAlta: '2017-02-01', Activo: true },
    { ArticuloId: 32, Nombre: 'LED 40" SAMSUNG SMART UN40F5500', Precio: 9774.00, CodigoDeBarra: '0880608565438', IdCategoria: 10, Stock: 639, FechaAlta: '2017-01-20', Activo: true },
    { ArticuloId: 33, Nombre: 'LED 40" SONY FHD KDL40R485', Precio: 7499.00, CodigoDeBarra: '0490552493532', IdCategoria: 10, Stock: 862, FechaAlta: '2017-01-07', Activo: true },
    { ArticuloId: 34, Nombre: 'LED 42" LG 3D 42LA6130', Precio: 9199.00, CodigoDeBarra: '0779808338817', IdCategoria: 10, Stock: 560, FechaAlta: '2017-01-05', Activo: true },
    { ArticuloId: 35, Nombre: 'LED 42" LG FHD 42LN5400', Precio: 8099.00, CodigoDeBarra: '0779808338818', IdCategoria: 10, Stock: 48, FechaAlta: '2017-01-28', Activo: true },
    { ArticuloId: 36, Nombre: 'LED 42" LG SMART TV 42LN5700', Precio: 9799.00, CodigoDeBarra: '0779808338823', IdCategoria: 10, Stock: 967, FechaAlta: '2017-01-27', Activo: true },
    { ArticuloId: 37, Nombre: 'LED 42" PANASONIC 3D SMART TV TCL42ET60', Precio: 11249.00, CodigoDeBarra: '0779805518074', IdCategoria: 10, Stock: 570, FechaAlta: '2017-01-19', Activo: true },
    { ArticuloId: 38, Nombre: 'LED 42" PHILIPS 3D SMART TV 42PFL5008G/7', Precio: 11599.00, CodigoDeBarra: '0871258167039', IdCategoria: 10, Stock: 802, FechaAlta: '2017-02-04', Activo: true },
    { ArticuloId: 39, Nombre: 'LED 42" PHILIPS FHD 42PFL3008D/77', Precio: 8499.00, CodigoDeBarra: '0871258167221', IdCategoria: 10, Stock: 193, FechaAlta: '2017-02-04', Activo: true },
    { ArticuloId: 40, Nombre: 'LED 42" PHILIPS SMART TV 42PFL3508G/77', Precio: 9499.00, CodigoDeBarra: '0871258167227', IdCategoria: 10, Stock: 693, FechaAlta: '2016-12-30', Activo: true },
    { ArticuloId: 41, Nombre: 'LED 42" PIONEER 3D SMART PLE42FZP2', Precio: 12299.00, CodigoDeBarra: '0498802821943', IdCategoria: 10, Stock: 907, FechaAlta: '2017-02-01', Activo: true },
    { ArticuloId: 42, Nombre: 'LED 42" SONY FHD KDL42R475', Precio: 7999.00, CodigoDeBarra: '0490552491728', IdCategoria: 10, Stock: 140, FechaAlta: '2017-01-13', Activo: true },
    { ArticuloId: 43, Nombre: 'LED 46" PHILIPS SMART TV 46PFL4508G/7', Precio: 13999.00, CodigoDeBarra: '0871258168718', IdCategoria: 10, Stock: 236, FechaAlta: '2017-01-31', Activo: true },
    { ArticuloId: 44, Nombre: 'LED 46" SAMSUNG 3D SMART TV UN46F7500', Precio: 23574.00, CodigoDeBarra: '0880608565943', IdCategoria: 10, Stock: 143, FechaAlta: '2016-12-25', Activo: true },
    { ArticuloId: 45, Nombre: 'LED 46" SAMSUNG SMART UN46F5500', Precio: 13224.00, CodigoDeBarra: '0880608548610', IdCategoria: 10, Stock: 345, FechaAlta: '2017-01-07', Activo: true },
    { ArticuloId: 46, Nombre: 'LED 46" SANYO SMART TV LCE46IF12', Precio: 10599.00, CodigoDeBarra: '0779696260612', IdCategoria: 10, Stock: 557, FechaAlta: '2017-02-03', Activo: true },
    { ArticuloId: 47, Nombre: 'LED 47" LG SMART TV 47LN5700', Precio: 13199.00, CodigoDeBarra: '0779808338824', IdCategoria: 10, Stock: 599, FechaAlta: '2017-01-20', Activo: true },
    { ArticuloId: 48, Nombre: 'LED 47" PIONEER 3D SMART PLE47FZP1', Precio: 15999.00, CodigoDeBarra: '0498802821947', IdCategoria: 10, Stock: 310, FechaAlta: '2017-02-07', Activo: true },
    { ArticuloId: 49, Nombre: 'LED 47" SONY 3D SMART TV KDL47W805', Precio: 17199.00, CodigoDeBarra: '0490552494098', IdCategoria: 10, Stock: 526, FechaAlta: '2017-01-31', Activo: true },
    { ArticuloId: 50, Nombre: 'LED 55" NOBLEX 3D IPTV 55LD856DI', Precio: 20799.00, CodigoDeBarra: '0779696260000', IdCategoria: 10, Stock: 362, FechaAlta: '2017-01-26', Activo: true },
    { ArticuloId: 51, Nombre: 'LED 55" PHILIPS 3D SMART TV 55PFL8008G/77', Precio: 29999.00, CodigoDeBarra: '0871258166949', IdCategoria: 10, Stock: 841, FechaAlta: '2017-01-06', Activo: true },
    { ArticuloId: 52, Nombre: 'SOPORTE LCD / LED DE 14" A 42" TANGWOOD', Precio: 599.00, CodigoDeBarra: '0779814176493', IdCategoria: 10, Stock: 527, FechaAlta: '2017-02-07', Activo: true },
    { ArticuloId: 53, Nombre: 'SOPORTE LCD / LED DE 17 \'\' A 40 \'\'', Precio: 499.00, CodigoDeBarra: '0779814176654', IdCategoria: 10, Stock: 588, FechaAlta: '2016-12-23', Activo: true },
    { ArticuloId: 54, Nombre: 'SOPORTE LCD / LED DE 17" A 37" TANGWOOD', Precio: 225.00, CodigoDeBarra: '0779814176489', IdCategoria: 10, Stock: 687, FechaAlta: '2017-01-29', Activo: true },
    { ArticuloId: 55, Nombre: 'SOPORTE LCD / LED DE 23 \'\' A 50 \'\'', Precio: 350.00, CodigoDeBarra: '0779814176652', IdCategoria: 10, Stock: 519, FechaAlta: '2016-12-25', Activo: true },
    { ArticuloId: 56, Nombre: 'SOPORTE LCD / LED DE 26" A 47" TANGWOOD', Precio: 350.00, CodigoDeBarra: '0779814176442', IdCategoria: 10, Stock: 81, FechaAlta: '2017-01-28', Activo: true },
    { ArticuloId: 57, Nombre: 'SOPORTE LCD / LED TGW DE 17 \'\' A 37 \'\'', Precio: 199.00, CodigoDeBarra: '0779814176648', IdCategoria: 10, Stock: 164, FechaAlta: '2017-01-17', Activo: true },
    { ArticuloId: 58, Nombre: 'SOPORTE LCD 10" TAGWOOD', Precio: 375.00, CodigoDeBarra: '0779814176490', IdCategoria: 10, Stock: 217, FechaAlta: '2017-01-31', Activo: true },
    { ArticuloId: 59, Nombre: 'SOPORTE LCD 32" NAKAN', Precio: 199.00, CodigoDeBarra: '0779803504550', IdCategoria: 10, Stock: 873, FechaAlta: '2017-01-01', Activo: true },
    { ArticuloId: 60, Nombre: 'SOPORTE LCD 32" ONE FOR ALL', Precio: 259.00, CodigoDeBarra: '0871618404213', IdCategoria: 10, Stock: 585, FechaAlta: '2017-01-30', Activo: true },
    { ArticuloId: 61, Nombre: 'SOPORTE LCD 40" ONE FOR ALL', Precio: 519.00, CodigoDeBarra: '0871618404215', IdCategoria: 10, Stock: 809, FechaAlta: '2017-01-22', Activo: true },
    { ArticuloId: 62, Nombre: 'SOPORTE LCD/LED 23 A 46"', Precio: 399.00, CodigoDeBarra: '0779814176617', IdCategoria: 10, Stock: 470, FechaAlta: '2017-01-21', Activo: true },
    { ArticuloId: 68, Nombre: 'SOPORTE GPS', Precio: 119.00, CodigoDeBarra: '0779814176084', IdCategoria: 8, Stock: 524, FechaAlta: '2017-01-14', Activo: true },
    { ArticuloId: 69, Nombre: 'SOPORTE GPS NEGRO MOTO 3,5" - 5,5"', Precio: 259.00, CodigoDeBarra: '0779808004535', IdCategoria: 8, Stock: 800, FechaAlta: '2017-02-05', Activo: true },
    { ArticuloId: 70, Nombre: 'GPS GARMIN NUVI 2595', Precio: 2899.00, CodigoDeBarra: '0075375999226', IdCategoria: 8, Stock: 745, FechaAlta: '2017-02-07', Activo: true },
    { ArticuloId: 71, Nombre: 'GPS GARMIN NUVI 52', Precio: 2149.00, CodigoDeBarra: '0075375999808', IdCategoria: 8, Stock: 274, FechaAlta: '2016-12-22', Activo: true },
    { ArticuloId: 72, Nombre: 'GPS X VIEW VENTURA TV 7"', Precio: 1849.00, CodigoDeBarra: '0779804220262', IdCategoria: 8, Stock: 150, FechaAlta: '2016-12-30', Activo: true },
    { ArticuloId: 73, Nombre: 'GPS XVIEW VENTURA TV', Precio: 1509.00, CodigoDeBarra: '0779804220220', IdCategoria: 8, Stock: 183, FechaAlta: '2017-01-05', Activo: true },
    { ArticuloId: 74, Nombre: 'MOUSE HP 2.4G SILVER WIRELESS OPT CAN/EN', Precio: 199.00, CodigoDeBarra: '0088496276058', IdCategoria: 9, Stock: 40, FechaAlta: '2017-02-03', Activo: true },
    { ArticuloId: 75, Nombre: 'PENDRIVE KINGSTONE DT101G2 8GB', Precio: 129.00, CodigoDeBarra: '0074061716983', IdCategoria: 9, Stock: 537, FechaAlta: '2016-12-21', Activo: true },
    { ArticuloId: 76, Nombre: 'PENDRIVE SANDISK BLADE 4GB', Precio: 129.00, CodigoDeBarra: '0061965900041', IdCategoria: 9, Stock: 340, FechaAlta: '2017-02-02', Activo: true },
    { ArticuloId: 77, Nombre: 'PENDRIVE SANDISK CRUZAR ORBIT 8GB', Precio: 159.00, CodigoDeBarra: '0061965909040', IdCategoria: 9, Stock: 696, FechaAlta: '2017-02-07', Activo: true },
    { ArticuloId: 78, Nombre: 'PENDRIVE SANDISK POP BLACK 8GB', Precio: 159.00, CodigoDeBarra: '0061965908448', IdCategoria: 9, Stock: 431, FechaAlta: '2017-01-08', Activo: true },
    { ArticuloId: 79, Nombre: 'PENDRIVE SANDISK POP PAIN 8GB', Precio: 159.00, CodigoDeBarra: '0061965908156', IdCategoria: 9, Stock: 521, FechaAlta: '2017-02-01', Activo: true },
    { ArticuloId: 80, Nombre: 'CARTUCHO EPSON 732 CYAN', Precio: 10290.00, CodigoDeBarra: '0001034385887', IdCategoria: 9, Stock: 234, FechaAlta: '2017-01-26', Activo: true },
    { ArticuloId: 81, Nombre: 'CARTUCHO EPSON T133120-AL MAGENTA', Precio: 9690.00, CodigoDeBarra: '0001034387695', IdCategoria: 9, Stock: 374, FechaAlta: '2016-12-26', Activo: true },
    { ArticuloId: 82, Nombre: 'CARTUCHO EPSON T133120-AL NEGRO', Precio: 8479.00, CodigoDeBarra: '0001034387692', IdCategoria: 9, Stock: 836, FechaAlta: '2017-01-25', Activo: true },
    { ArticuloId: 83, Nombre: 'CARTUCHO EPSON T133420-AL AMARILLO', Precio: 9690.00, CodigoDeBarra: '0001034387696', IdCategoria: 9, Stock: 796, FechaAlta: '2016-12-28', Activo: true },
    { ArticuloId: 84, Nombre: 'CARTUCHO HP 122 NEGRO', Precio: 149.00, CodigoDeBarra: '0088496298354', IdCategoria: 9, Stock: 373, FechaAlta: '2017-02-05', Activo: true },
    { ArticuloId: 85, Nombre: 'CARTUCHO HP 22 COLOR', Precio: 299.00, CodigoDeBarra: '0082916090222', IdCategoria: 9, Stock: 199, FechaAlta: '2017-01-01', Activo: true },
    { ArticuloId: 86, Nombre: 'CARTUCHO HP 60 COLOR', Precio: 289.00, CodigoDeBarra: '0088358598319', IdCategoria: 9, Stock: 801, FechaAlta: '2017-01-31', Activo: true },
    { ArticuloId: 87, Nombre: 'CARTUCHO HP 60 NEGRO', Precio: 199.00, CodigoDeBarra: '0088358598317', IdCategoria: 9, Stock: 655, FechaAlta: '2017-01-08', Activo: true },
    { ArticuloId: 88, Nombre: 'PC ALL IN ONE 120-1156LA + TECLADO INAL + MOUSE', Precio: 5499.00, CodigoDeBarra: '0088611278012', IdCategoria: 9, Stock: 331, FechaAlta: '2017-01-19', Activo: true },
    { ArticuloId: 90, Nombre: 'IMPRESORA MULTIFUNCION EPSON L355', Precio: 3999.00, CodigoDeBarra: '0001034390469', IdCategoria: 9, Stock: 293, FechaAlta: '2017-01-01', Activo: true },
    { ArticuloId: 91, Nombre: 'MULTIFUNCION EPSON L210 + SISTEMA CONTINUO', Precio: 3399.00, CodigoDeBarra: '0001034390433', IdCategoria: 9, Stock: 689, FechaAlta: '2017-01-09', Activo: true },
    { ArticuloId: 92, Nombre: 'MULTIFUNCION EPSON XP211', Precio: 1199.00, CodigoDeBarra: '0001034390754', IdCategoria: 9, Stock: 693, FechaAlta: '2017-01-08', Activo: true },
    { ArticuloId: 93, Nombre: 'MULTIFUNCION EPSON XP401', Precio: 1799.00, CodigoDeBarra: '0001034390348', IdCategoria: 9, Stock: 363, FechaAlta: '2017-01-17', Activo: true },
    { ArticuloId: 94, Nombre: 'NOTEBOOK BGH C-530 3D', Precio: 4999.00, CodigoDeBarra: '0779816664067', IdCategoria: 9, Stock: 401, FechaAlta: '2017-01-30', Activo: true },
    { ArticuloId: 95, Nombre: 'NOTEBOOK BGH C-550', Precio: 5799.00, CodigoDeBarra: '0779816664065', IdCategoria: 9, Stock: 230, FechaAlta: '2017-01-04', Activo: true },
    { ArticuloId: 96, Nombre: 'NOTEBOOK BGH C-565', Precio: 6299.00, CodigoDeBarra: '0779816664069', IdCategoria: 9, Stock: 876, FechaAlta: '2017-02-06', Activo: true },
    { ArticuloId: 97, Nombre: 'NOTEBOOK BGH C-570', Precio: 7299.00, CodigoDeBarra: '0779816664070', IdCategoria: 9, Stock: 929, FechaAlta: '2017-01-17', Activo: true },
    { ArticuloId: 98, Nombre: 'NOTEBOOK BGH QL 300 MINI', Precio: 3699.00, CodigoDeBarra: '0779816664101', IdCategoria: 9, Stock: 176, FechaAlta: '2017-01-28', Activo: true },
    { ArticuloId: 99, Nombre: 'NOTEBOOK DELL INSPIRON 14 3421 I14I32_45', Precio: 6599.00, CodigoDeBarra: '0789948950198', IdCategoria: 9, Stock: 758, FechaAlta: '2016-12-31', Activo: true },
    { ArticuloId: 100, Nombre: 'NOTEBOOK DELL INSPIRON 14 3421 I14V997_4', Precio: 5999.00, CodigoDeBarra: '0779801657005', IdCategoria: 9, Stock: 666, FechaAlta: '2016-12-20', Activo: true },
    { ArticuloId: 101, Nombre: 'NOTEBOOK LENOVO G485 C-70', Precio: 4399.00, CodigoDeBarra: '0088761972842', IdCategoria: 9, Stock: 115, FechaAlta: '2017-01-21', Activo: true },
    { ArticuloId: 102, Nombre: 'NOTEBOOK NOBLEX CEVEN GFAST', Precio: 4499.00, CodigoDeBarra: '0779808041201', IdCategoria: 9, Stock: 853, FechaAlta: '2017-02-07', Activo: true },
    { ArticuloId: 103, Nombre: 'NOTEBOOK POSITIVO BGH F-810N NEGRA', Precio: 4999.00, CodigoDeBarra: '0779816664059', IdCategoria: 9, Stock: 48, FechaAlta: '2017-01-21', Activo: true },
    { ArticuloId: 104, Nombre: 'NOTEBOOK SAMSUNG NP300E4C', Precio: 6999.00, CodigoDeBarra: '0880608528173', IdCategoria: 9, Stock: 272, FechaAlta: '2017-01-08', Activo: true },
    { ArticuloId: 105, Nombre: 'NOTEBOOK SAMSUNG NP300E5A AD4AR', Precio: 4799.00, CodigoDeBarra: '0880608500428', IdCategoria: 9, Stock: 194, FechaAlta: '2017-01-18', Activo: true },
    { ArticuloId: 106, Nombre: 'ULTRABOOK ACER S3-391-6867', Precio: 9793.00, CodigoDeBarra: '0471219655495', IdCategoria: 9, Stock: 974, FechaAlta: '2017-01-23', Activo: true },
    { ArticuloId: 107, Nombre: 'ADAPTADOR PCI WIFI TL-WN751ND', Precio: 259.00, CodigoDeBarra: '0693536405056', IdCategoria: 9, Stock: 171, FechaAlta: '2017-01-15', Activo: false },
    { ArticuloId: 110, Nombre: 'ANTENA TP-LINK TL-ANT2408C', Precio: 249.00, CodigoDeBarra: '0693536405216', IdCategoria: 9, Stock: 689, FechaAlta: '2016-12-26', Activo: true },
    { ArticuloId: 111, Nombre: 'MINI ADAPATADOR USB TP LINK WN723N', Precio: 185.00, CodigoDeBarra: '0693536405055', IdCategoria: 9, Stock: 382, FechaAlta: '2016-12-31', Activo: true },
    { ArticuloId: 112, Nombre: 'ROUTER MR3420 3G TP-LINK', Precio: 649.00, CodigoDeBarra: '0693536405149', IdCategoria: 9, Stock: 143, FechaAlta: '2016-12-21', Activo: true },
    { ArticuloId: 113, Nombre: 'ROUTER PORTATIL TP LINK TL-MR3020', Precio: 499.00, CodigoDeBarra: '0693536405170', IdCategoria: 9, Stock: 594, FechaAlta: '2017-02-01', Activo: true },
    { ArticuloId: 114, Nombre: 'ROUTER TL-WR941ND TP LINK', Precio: 759.00, CodigoDeBarra: '0693536405127', IdCategoria: 9, Stock: 646, FechaAlta: '2017-02-06', Activo: true },
    { ArticuloId: 115, Nombre: 'ROUTER TP-LINK TL-WR720N', Precio: 309.00, CodigoDeBarra: '0693536405198', IdCategoria: 9, Stock: 867, FechaAlta: '2017-01-01', Activo: true },
    { ArticuloId: 116, Nombre: 'ROUTER WR740 TP-LINK', Precio: 389.00, CodigoDeBarra: '0693536405133', IdCategoria: 9, Stock: 925, FechaAlta: '2017-01-28', Activo: true },
    { ArticuloId: 117, Nombre: 'ROUTER WR841 TP-LINK', Precio: 469.00, CodigoDeBarra: '0693536405124', IdCategoria: 9, Stock: 624, FechaAlta: '2017-01-29', Activo: true },
    { ArticuloId: 118, Nombre: 'TABLET MAGNUM TECH 7"', Precio: 2599.00, CodigoDeBarra: '0779813546539', IdCategoria: 9, Stock: 344, FechaAlta: '2016-12-26', Activo: true },
    { ArticuloId: 119, Nombre: 'TABLET 10" MAGNUM TECH 8GB 1GBM', Precio: 3799.00, CodigoDeBarra: '0779813546540', IdCategoria: 9, Stock: 751, FechaAlta: '2017-01-24', Activo: true },
    { ArticuloId: 120, Nombre: 'TABLET 10" NOBLEX NB1012', Precio: 3549.00, CodigoDeBarra: '0779696292015', IdCategoria: 9, Stock: 319, FechaAlta: '2017-01-13', Activo: true },
    { ArticuloId: 121, Nombre: 'TABLET ALCATEL AB10', Precio: 1799.00, CodigoDeBarra: '0695508989953', IdCategoria: 9, Stock: 939, FechaAlta: '2017-02-01', Activo: true },
    { ArticuloId: 122, Nombre: 'TABLET EUROCASE ARS 708', Precio: 1099.00, CodigoDeBarra: '0779813546928', IdCategoria: 9, Stock: 534, FechaAlta: '2017-01-26', Activo: true },
    { ArticuloId: 123, Nombre: 'TABLET FUNTAB PRO', Precio: 1699.00, CodigoDeBarra: '0081770701101', IdCategoria: 9, Stock: 869, FechaAlta: '2017-01-23', Activo: true },
    { ArticuloId: 124, Nombre: 'TABLET IDEAPAD LENOVO A1000L', Precio: 2799.00, CodigoDeBarra: '0088794260611', IdCategoria: 9, Stock: 597, FechaAlta: '2017-01-05', Activo: true },
    { ArticuloId: 125, Nombre: 'TABLET LENOVO IDEAPAD A1000 7"', Precio: 2299.00, CodigoDeBarra: '0088777046041', IdCategoria: 9, Stock: 510, FechaAlta: '2017-02-04', Activo: true },
    { ArticuloId: 126, Nombre: 'TABLET MAGNUM MG-701', Precio: 1499.00, CodigoDeBarra: '0779813546946', IdCategoria: 9, Stock: 645, FechaAlta: '2017-02-05', Activo: true },
    { ArticuloId: 127, Nombre: 'TABLET NOBLEX-8013 8\'', Precio: 2149.00, CodigoDeBarra: '0779696291801', IdCategoria: 9, Stock: 850, FechaAlta: '2017-01-17', Activo: true },
    { ArticuloId: 130, Nombre: 'TABLET OLIPAD SMART 7" 3G', Precio: 1499.00, CodigoDeBarra: '0802033432056', IdCategoria: 9, Stock: 489, FechaAlta: '2017-02-07', Activo: true },
    { ArticuloId: 131, Nombre: 'TABLET PC 7001 TITAN', Precio: 999.00, CodigoDeBarra: '0076113310158', IdCategoria: 9, Stock: 850, FechaAlta: '2016-12-24', Activo: true },
    { ArticuloId: 132, Nombre: 'TABLET PC BOX T700U 7" DUAL CORE', Precio: 1999.00, CodigoDeBarra: '0779815876409', IdCategoria: 9, Stock: 769, FechaAlta: '2017-02-06', Activo: true },
    { ArticuloId: 133, Nombre: 'TABLET PC FIRSTAR MID070A 8650', Precio: 799.00, CodigoDeBarra: '0779815467080', IdCategoria: 9, Stock: 9, FechaAlta: '2017-01-23', Activo: true },
    { ArticuloId: 134, Nombre: 'TABLET PCBOX MOD T900', Precio: 2799.00, CodigoDeBarra: '0779815876410', IdCategoria: 9, Stock: 501, FechaAlta: '2017-01-25', Activo: true },
    { ArticuloId: 135, Nombre: 'TABLET POLAROID MID1000 10', Precio: 4299.00, CodigoDeBarra: '0358417655560', IdCategoria: 9, Stock: 151, FechaAlta: '2016-12-23', Activo: true },
    { ArticuloId: 136, Nombre: 'TABLET SYNKOM 7"', Precio: 2499.00, CodigoDeBarra: '0779816920041', IdCategoria: 9, Stock: 695, FechaAlta: '2016-12-23', Activo: true },
    { ArticuloId: 137, Nombre: 'TABLET XVIEW ALPHA2 8GB', Precio: 1899.00, CodigoDeBarra: '0779804220264', IdCategoria: 9, Stock: 565, FechaAlta: '2017-02-05', Activo: true },
    { ArticuloId: 138, Nombre: 'TABLET XVIEW PROTON', Precio: 1699.00, CodigoDeBarra: '0779804220247', IdCategoria: 9, Stock: 3, FechaAlta: '2016-12-28', Activo: true },
    { ArticuloId: 139, Nombre: 'AIRE ACONDICIONADO DAEWOO 3200FC DWT23200FC', Precio: 5898.00, CodigoDeBarra: '0779816944014', IdCategoria: 7, Stock: 668, FechaAlta: '2018-01-04', Activo: true },
    { ArticuloId: 140, Nombre: 'AIRE ACONDICIONADO DURABRAND 3500FC DUS35WCL4', Precio: 5499.00, CodigoDeBarra: '0779688543933', IdCategoria: 7, Stock: 945, FechaAlta: '2017-01-20', Activo: true },
    { ArticuloId: 141, Nombre: 'AIRE ACONDICIONADO DURABRAND 4500FC DUS53WCL4', Precio: 7499.00, CodigoDeBarra: '0779688543937', IdCategoria: 7, Stock: 962, FechaAlta: '2016-12-29', Activo: true },
    { ArticuloId: 142, Nombre: 'AIRE ACONDICIONADO KELVINATOR 2500WFC COD1056', Precio: 4499.00, CodigoDeBarra: '0779694101056', IdCategoria: 7, Stock: 670, FechaAlta: '2017-01-03', Activo: true },
    { ArticuloId: 143, Nombre: 'AIRE ACONDICIONADO LG 3000 FC H126TNW0', Precio: 7499.00, CodigoDeBarra: '0779808338858', IdCategoria: 7, Stock: 441, FechaAlta: '2017-01-09', Activo: true },
    { ArticuloId: 144, Nombre: 'AIRE ACONDICIONADO LG 4500 FC H1865NW0', Precio: 10399.00, CodigoDeBarra: '0779808338859', IdCategoria: 7, Stock: 971, FechaAlta: '2016-12-23', Activo: true },
    { ArticuloId: 145, Nombre: 'AIRE ACONDICIONADO LG 5500 FC H2465NW0', Precio: 12699.00, CodigoDeBarra: '0779808338860', IdCategoria: 7, Stock: 648, FechaAlta: '2017-01-15', Activo: true },
    { ArticuloId: 146, Nombre: 'AIRE ACONDICIONADO LG ARTCOOL 2300FC H096EFT0', Precio: 7999.00, CodigoDeBarra: '0779808338853', IdCategoria: 7, Stock: 659, FechaAlta: '2017-01-01', Activo: true },
    { ArticuloId: 147, Nombre: 'AIRE ACONDICIONADO LG ARTCOOL 4500FC H1868FT0', Precio: 12899.00, CodigoDeBarra: '0779808338855', IdCategoria: 7, Stock: 712, FechaAlta: '2016-12-25', Activo: true },
    { ArticuloId: 148, Nombre: 'AIRE ACONDICIONADO PHILCO 3200W FC PHS32H13X', Precio: 6199.00, CodigoDeBarra: '0779696244974', IdCategoria: 7, Stock: 588, FechaAlta: '2017-01-09', Activo: true },
    { ArticuloId: 149, Nombre: 'AIRE ACONDICIONADO PHILCO 5000W FC PHS50H13X', Precio: 9099.00, CodigoDeBarra: '0779696242975', IdCategoria: 7, Stock: 275, FechaAlta: '2016-12-22', Activo: true },
    { ArticuloId: 150, Nombre: 'AIRE ACONDICIONADO PORTATIL DURABRAND 2500FS LGACD01', Precio: 4999.00, CodigoDeBarra: '0073621119267', IdCategoria: 7, Stock: 995, FechaAlta: '2017-01-26', Activo: true },
    { ArticuloId: 151, Nombre: 'AIRE ACONDICIONADO SAMSUNG 3000FC AR12FQFTAUR', Precio: 7949.00, CodigoDeBarra: '0880608575497', IdCategoria: 7, Stock: 34, FechaAlta: '2017-01-03', Activo: true },
    { ArticuloId: 152, Nombre: 'AIRE ACONDICIONADO SANYO 2600W FC KC913HSAN', Precio: 6099.00, CodigoDeBarra: '0779696244956', IdCategoria: 7, Stock: 372, FechaAlta: '2017-01-23', Activo: true },
    { ArticuloId: 153, Nombre: 'AIRE ACONDICIONADO SANYO 3200W FC KC1213HSAN', Precio: 6899.00, CodigoDeBarra: '0779696242957', IdCategoria: 7, Stock: 260, FechaAlta: '2017-02-02', Activo: true },
    { ArticuloId: 154, Nombre: 'AIRE ACONDICIONADO SURREYPRIA 2250FC 553EPQ0913F', Precio: 6929.00, CodigoDeBarra: '0779708708630', IdCategoria: 7, Stock: 38, FechaAlta: '2016-12-30', Activo: true },
    { ArticuloId: 155, Nombre: 'AIRE ACONDICIONADO SURREYPRIA 3000FC 553EPQ1213F', Precio: 7949.00, CodigoDeBarra: '0779708708631', IdCategoria: 7, Stock: 180, FechaAlta: '2017-01-04', Activo: true },
    { ArticuloId: 156, Nombre: 'AIRE ACONDICIONADO SURREYPRIA 4500FC 553EPQ1813F', Precio: 11849.00, CodigoDeBarra: '0779708708632', IdCategoria: 7, Stock: 232, FechaAlta: '2017-01-07', Activo: true },
    { ArticuloId: 157, Nombre: 'AIRE ACONDICIONADO SURREYPRIA 5500FC 553EPQ2213F', Precio: 14329.00, CodigoDeBarra: '0779708708633', IdCategoria: 7, Stock: 909, FechaAlta: '2017-01-10', Activo: true },
    { ArticuloId: 158, Nombre: 'CALEFACTOR SIN SALIDA 4000 KCAL VOLCAN', Precio: 1159.00, CodigoDeBarra: '0779703781219', IdCategoria: 7, Stock: 598, FechaAlta: '2016-12-23', Activo: true },
    { ArticuloId: 159, Nombre: 'CALEFACTOR SIN SALIDA ORBIS 4200 KCAL', Precio: 1469.00, CodigoDeBarra: '0779703781123', IdCategoria: 7, Stock: 504, FechaAlta: '2017-01-11', Activo: false },
    { ArticuloId: 160, Nombre: 'ESTUFA ORBIS TIRO BALANCEADO 5000 K', Precio: 2019.00, CodigoDeBarra: '0779703781129', IdCategoria: 7, Stock: 600, FechaAlta: '2017-01-17', Activo: true },
    { ArticuloId: 161, Nombre: 'ESTUFA VOLCAN TIRO BALANCEADO 2000 KCAL 42312V', Precio: 1439.00, CodigoDeBarra: '0779703781220', IdCategoria: 7, Stock: 602, FechaAlta: '2016-12-28', Activo: true },
    { ArticuloId: 162, Nombre: 'ESTUFA VOLCAN TIRO BALANCEADO NEGRO 3800 43712V', Precio: 1679.00, CodigoDeBarra: '0779703781221', IdCategoria: 7, Stock: 650, FechaAlta: '2017-02-04', Activo: true },
    { ArticuloId: 163, Nombre: 'TIRO BALANCEADO 3500 KCAL EMEGE', Precio: 1605.00, CodigoDeBarra: '0779135400180', IdCategoria: 7, Stock: 474, FechaAlta: '2017-01-29', Activo: true },
    { ArticuloId: 164, Nombre: 'CALEFACTOR ELECTRICO CLEVER VIDRIO H1107', Precio: 1950.00, CodigoDeBarra: '0779815957117', IdCategoria: 7, Stock: 459, FechaAlta: '2016-12-29', Activo: true },
    { ArticuloId: 165, Nombre: 'CALEFACTOR ELECTRICO CONVECCION CON-1800', Precio: 1599.00, CodigoDeBarra: '0779814958212', IdCategoria: 7, Stock: 10, FechaAlta: '2017-01-13', Activo: true },
    { ArticuloId: 166, Nombre: 'CALEFACTOR ELECTRICO CONVECCION CON-2000N', Precio: 790.00, CodigoDeBarra: '0779815957180', IdCategoria: 7, Stock: 112, FechaAlta: '2017-01-11', Activo: true },
    { ArticuloId: 167, Nombre: 'CALEFACTOR ELECTRICO CONVECCION CON-2000R', Precio: 790.00, CodigoDeBarra: '0779815957181', IdCategoria: 7, Stock: 141, FechaAlta: '2017-01-26', Activo: true },
    { ArticuloId: 168, Nombre: 'CALEFACTOR LILIANA INFRARROJO CI062', Precio: 345.00, CodigoDeBarra: '0779386200687', IdCategoria: 7, Stock: 516, FechaAlta: '2016-12-27', Activo: true },
    { ArticuloId: 169, Nombre: 'CALEFACTOR PANEL 500 WATTS', Precio: 769.00, CodigoDeBarra: '0779813482002', IdCategoria: 7, Stock: 804, FechaAlta: '2017-01-03', Activo: true },
    { ArticuloId: 170, Nombre: 'CALOVENTOR 2000 W AXEL AX-CA100', Precio: 249.00, CodigoDeBarra: '0779811896139', IdCategoria: 7, Stock: 780, FechaAlta: '2017-01-10', Activo: true },
    { ArticuloId: 171, Nombre: 'CALOVENTOR DE PARED 2000 W KENBROWN', Precio: 839.00, CodigoDeBarra: '0779811320136', IdCategoria: 7, Stock: 737, FechaAlta: '2016-12-28', Activo: true },
    { ArticuloId: 172, Nombre: 'CALOVENTOR DE PARED PROTALIA CP200A', Precio: 799.00, CodigoDeBarra: '0779811559131', IdCategoria: 7, Stock: 833, FechaAlta: '2017-01-30', Activo: true },
    { ArticuloId: 173, Nombre: 'CALOVENTOR ELECTRICO BLANCO 1500W LE1500B', Precio: 599.00, CodigoDeBarra: '0779815957245', IdCategoria: 7, Stock: 492, FechaAlta: '2017-01-04', Activo: true },
    { ArticuloId: 174, Nombre: 'CALOVENTOR ELECTRICO LE1500ROJO', Precio: 599.00, CodigoDeBarra: '0779815957247', IdCategoria: 7, Stock: 437, FechaAlta: '2017-01-29', Activo: true },
    { ArticuloId: 175, Nombre: 'CALOVENTOR ELECTRICO NEGRO 1500W LE1500N', Precio: 599.00, CodigoDeBarra: '0779815957246', IdCategoria: 7, Stock: 875, FechaAlta: '2017-01-09', Activo: true },
    { ArticuloId: 176, Nombre: 'CALOVENTOR ELECTROLUX SPLIT CONTROL REMOTO', Precio: 999.00, CodigoDeBarra: '0779386200613', IdCategoria: 7, Stock: 675, FechaAlta: '2016-12-20', Activo: true },
    { ArticuloId: 177, Nombre: 'CALOVENTOR KEN BROWN 2000 W', Precio: 319.00, CodigoDeBarra: '0779811320075', IdCategoria: 7, Stock: 76, FechaAlta: '2017-01-23', Activo: true },
    { ArticuloId: 178, Nombre: 'CALOVENTOR RESISTENCIA CERAMICA', Precio: 319.00, CodigoDeBarra: '0557306319076', IdCategoria: 7, Stock: 243, FechaAlta: '2017-01-08', Activo: true },
    { ArticuloId: 179, Nombre: 'CIRCULADOR DE AIRE FRIO CALOR DURABRAND', Precio: 1049.00, CodigoDeBarra: '0073621119287', IdCategoria: 7, Stock: 121, FechaAlta: '2017-01-30', Activo: true },
    { ArticuloId: 180, Nombre: 'CONVECTOR AXEL 2000 W AX-COT100', Precio: 689.00, CodigoDeBarra: '0779811896141', IdCategoria: 7, Stock: 357, FechaAlta: '2016-12-24', Activo: true },
    { ArticuloId: 181, Nombre: 'CONVECTOR AXEL 2000 W CON TURBO AX-COT', Precio: 609.00, CodigoDeBarra: '0779811896131', IdCategoria: 7, Stock: 246, FechaAlta: '2017-01-16', Activo: true },
    { ArticuloId: 182, Nombre: 'CONVECTOR CLEVER CLEVERBLANCO CON2000B', Precio: 790.00, CodigoDeBarra: '0779815957179', IdCategoria: 7, Stock: 229, FechaAlta: '2017-01-09', Activo: true },
    { ArticuloId: 183, Nombre: 'CONVECTOR TELEFUNKEN 2000 WATT C1009', Precio: 479.00, CodigoDeBarra: '0779724533114', IdCategoria: 7, Stock: 642, FechaAlta: '2016-12-29', Activo: true },
    { ArticuloId: 184, Nombre: 'ESTUFA ELECTROLUX HALOGENAS HAL18G', Precio: 549.00, CodigoDeBarra: '0779386200254', IdCategoria: 7, Stock: 295, FechaAlta: '2017-01-15', Activo: true },
    { ArticuloId: 185, Nombre: 'ESTUFA ELECTRICA KEN BROWN 2 VELAS 800 KB 22', Precio: 245.00, CodigoDeBarra: '0779811320288', IdCategoria: 7, Stock: 598, FechaAlta: '2016-12-24', Activo: true },
    { ArticuloId: 186, Nombre: 'ESTUFA HALOGENA 3 VELAS KEN BROWN', Precio: 409.00, CodigoDeBarra: '0779811320134', IdCategoria: 7, Stock: 580, FechaAlta: '2016-12-24', Activo: true },
    { ArticuloId: 187, Nombre: 'ESTUFA HALOGENA 4 VELAS KEN BROWN', Precio: 449.00, CodigoDeBarra: '0779811320135', IdCategoria: 7, Stock: 741, FechaAlta: '2017-01-28', Activo: true },
    { ArticuloId: 188, Nombre: 'ESTUFA HALOGENA ELECTROLUX 1600W SIN OSCILACION HAL18A', Precio: 499.00, CodigoDeBarra: '0779386200253', IdCategoria: 7, Stock: 632, FechaAlta: '2016-12-23', Activo: true },
    { ArticuloId: 189, Nombre: 'ESTUFA HALOGENA MAGIC 1200 W C1007', Precio: 189.00, CodigoDeBarra: '0779724533112', IdCategoria: 7, Stock: 518, FechaAlta: '2016-12-26', Activo: true },
    { ArticuloId: 190, Nombre: 'PANEL 1000W ATMA', Precio: 99999.00, CodigoDeBarra: '0779696280631', IdCategoria: 7, Stock: 951, FechaAlta: '2017-01-17', Activo: true },
    { ArticuloId: 191, Nombre: 'PANEL 2000 W NEGRO ENERGY SAVE', Precio: 1499.00, CodigoDeBarra: '0779814951036', IdCategoria: 7, Stock: 647, FechaAlta: '2016-12-20', Activo: true },
    { ArticuloId: 192, Nombre: 'PANEL 500 W ECOSOL', Precio: 1119.00, CodigoDeBarra: '0779813482029', IdCategoria: 7, Stock: 805, FechaAlta: '2017-01-18', Activo: true },
    { ArticuloId: 193, Nombre: 'PANEL 900W ECOSOL 1-502', Precio: 1869.00, CodigoDeBarra: '0779813482031', IdCategoria: 7, Stock: 726, FechaAlta: '2017-02-01', Activo: true },
    { ArticuloId: 194, Nombre: 'PANEL MICA ELECTROLUX RMIC15', Precio: 999.00, CodigoDeBarra: '0779386200256', IdCategoria: 7, Stock: 331, FechaAlta: '2016-12-26', Activo: true },
    { ArticuloId: 195, Nombre: 'PANEL PIETRA 500 W PEISA', Precio: 699.00, CodigoDeBarra: '0779808116284', IdCategoria: 7, Stock: 171, FechaAlta: '2017-01-27', Activo: true },
    { ArticuloId: 196, Nombre: 'RADIADOR DE MICA ELECTROLUX 1000W RALU01', Precio: 699.00, CodigoDeBarra: '0779817317015', IdCategoria: 7, Stock: 987, FechaAlta: '2017-01-24', Activo: true },
    { ArticuloId: 197, Nombre: 'TURBO CALENTADOR 2000W TCAL2000', Precio: 590.00, CodigoDeBarra: '0779815957248', IdCategoria: 7, Stock: 539, FechaAlta: '2017-01-03', Activo: true },
    { ArticuloId: 198, Nombre: 'VENTILADOR DE PIE DURABRAND 18" VP21', Precio: 122.00, CodigoDeBarra: '0779797170650', IdCategoria: 7, Stock: 318, FechaAlta: '2017-01-31', Activo: true },
    { ArticuloId: 199, Nombre: 'CAMARA DIGITAL C1433 SLVER GE', Precio: 899.00, CodigoDeBarra: '0084695100018', IdCategoria: 6, Stock: 528, FechaAlta: '2017-02-02', Activo: true },
    { ArticuloId: 200, Nombre: 'LIMPIADOR CD SV 8336 ONE FOR ALL', Precio: 55.00, CodigoDeBarra: '0871618404342', IdCategoria: 1, Stock: 508, FechaAlta: '2016-12-27', Activo: true },
    { ArticuloId: 201, Nombre: 'LIMPIADOR LCD SV 8410 ONE FOR ALL', Precio: 102.00, CodigoDeBarra: '0871618404333', IdCategoria: 1, Stock: 186, FechaAlta: '2017-02-02', Activo: true },
  ]);
}

async function DatosCategorias() {
  await categorias.bulkCreate([
    { Stock: 1, Nombre: 'ACCESORIOS' },
    { Stock: 2, Nombre: 'AUDIO' },
    { Stock: 3, Nombre: 'CELULARES' },
    { Stock: 4, Nombre: 'CUIDADO PERSONAL' },
    { Stock: 5, Nombre: 'DVD' },
    { Stock: 6, Nombre: 'FOTOGRAFIA' },
    { Stock: 7, Nombre: 'FRIO-CALOR' },
    { Stock: 8, Nombre: 'GPS' },
    { Stock: 9, Nombre: 'INFORMATICA' },
    { Stock: 10, Nombre: 'LED - LCD' },
  ]);
}

async function DatosUsuarios() {
  
  await usuarios.bulkCreate([
    { UsuarioId: 1, Nombre: 'admin', Clave: '123', Rol: 'jefe' },
    { UsuarioId: 2, Nombre: 'juan', Clave: '123', Rol: 'empleado' },
    { UsuarioId: 3, Nombre: 'ana', Clave: 'ana123', Rol: 'empleado' },
  ], { individualHooks: true }); // individualHooks: true para que se ejecuten los hooks beforeCreate (ej: hashear la clave)
}



async function DatosClientes() {
  await clientes.bulkCreate([
    { Nombre: 'GARCIA JUAN', Cuit: '20304050601', Mail: 'jgarcia@mail.com', CreditoMaximo: 50000.00, FechaNacimiento: '1985-03-15', FechaIngreso: '2020-01-10', Localidad: 'CORDOBA CAPITAL', Calle: 'SAN MARTIN', NumeroCalle: '1234', Activo: true },
    { Nombre: 'LOPEZ MARIA', Cuit: '27254060702', Mail: 'mlopez@mail.com', CreditoMaximo: 75000.00, FechaNacimiento: '1990-07-22', FechaIngreso: '2019-06-15', Localidad: 'ROSARIO CENTRO', Calle: 'BELGRANO', NumeroCalle: '567', Activo: true },
    { Nombre: 'MARTINEZ CARLOS', Cuit: '20356070803', Mail: 'cmartinez@mail.com', CreditoMaximo: 30000.00, FechaNacimiento: '1978-11-05', FechaIngreso: '2021-03-20', Localidad: 'BUENOS AIRES NORTE', Calle: 'RIVADAVIA', NumeroCalle: '890', Activo: true },
    { Nombre: 'RODRIGUEZ ANA', Cuit: '27408080904', Mail: 'arodriguez@mail.com', CreditoMaximo: 120000.00, FechaNacimiento: '1995-01-30', FechaIngreso: '2018-09-01', Localidad: 'MENDOZA CENTRO', Calle: 'LAS HERAS', NumeroCalle: '2345', Activo: true },
    { Nombre: 'FERNANDEZ PEDRO', Cuit: '20459091005', Mail: 'pfernandez@mail.com', CreditoMaximo: 45000.00, FechaNacimiento: '1982-06-18', FechaIngreso: '2022-01-15', Localidad: 'SANTA FE CENTRO', Calle: 'SAN JERONIMO', NumeroCalle: '678', Activo: false },
    { Nombre: 'GOMEZ LAURA', Cuit: '27501010106', Mail: 'lgomez@mail.com', CreditoMaximo: 90000.00, FechaNacimiento: '1988-12-25', FechaIngreso: '2017-04-10', Localidad: 'TUCUMAN CENTRO', Calle: 'MAIPU', NumeroCalle: '1011', Activo: true },
    { Nombre: 'DIAZ ROBERTO', Cuit: '20602020207', Mail: 'rdiaz@mail.com', CreditoMaximo: 60000.00, FechaNacimiento: '1975-09-08', FechaIngreso: '2023-07-20', Localidad: 'SALTA CAPITAL', Calle: 'CASEROS', NumeroCalle: '345', Activo: true },
    { Nombre: 'PEREZ LUCIANA', Cuit: '27703030308', Mail: 'lperez@mail.com', CreditoMaximo: 55000.00, FechaNacimiento: '1993-04-12', FechaIngreso: '2020-11-05', Localidad: 'CORDOBA NUEVA', Calle: 'VELEZ SARSFIELD', NumeroCalle: '1567', Activo: true },
    { Nombre: 'SANCHEZ MARTIN', Cuit: '20804040409', Mail: 'msanchez@mail.com', CreditoMaximo: 40000.00, FechaNacimiento: '1980-08-20', FechaIngreso: '2021-09-12', Localidad: 'LA PLATA CENTRO', Calle: 'CALLE SIETE', NumeroCalle: '789', Activo: false },
    { Nombre: 'RAMIREZ SOFIA', Cuit: '27905050510', Mail: 'sramirez@mail.com', CreditoMaximo: 85000.00, FechaNacimiento: '1997-02-14', FechaIngreso: '2019-12-01', Localidad: 'MAR DEL PLATA', Calle: 'INDEPENDENCIA', NumeroCalle: '2100', Activo: true },
  ]);
}


async function DatosVentas() {
  await ventascabecera.bulkCreate([
    { IdCliente: 1, Fecha: '2026-03-01', Total: 5968.00 },
    { IdCliente: 2, Fecha: '2026-03-02', Total: 2669.00 },
    { IdCliente: 3, Fecha: '2026-03-03', Total: 1048.00 },
    { IdCliente: 1, Fecha: '2026-03-05', Total: 12598.00 },
    { IdCliente: 4, Fecha: '2026-03-07', Total: 3399.00 },
  ]);

  await ventasdetalle.bulkCreate([
    // Venta 1
    { IdVenta: 1, IdArticulo: 1, Cantidad: 2, Precio: 299.00 },
    { IdVenta: 1, IdArticulo: 3, Cantidad: 2, Precio: 2669.00 },
    { IdVenta: 1, IdArticulo: 75, Cantidad: 1, Precio: 129.00 },
    // Venta 2
    { IdVenta: 2, IdArticulo: 3, Cantidad: 1, Precio: 2669.00 },
    // Venta 3
    { IdVenta: 3, IdArticulo: 2, Cantidad: 2, Precio: 349.00 },
    { IdVenta: 3, IdArticulo: 55, Cantidad: 1, Precio: 350.00 },
    // Venta 4
    { IdVenta: 4, IdArticulo: 29, Cantidad: 1, Precio: 12598.00 },
    // Venta 5
    { IdVenta: 5, IdArticulo: 91, Cantidad: 1, Precio: 3399.00 },
  ]);
}


module.exports = inicializarBase;