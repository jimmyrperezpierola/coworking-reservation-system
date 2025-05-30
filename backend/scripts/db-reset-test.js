// scripts/db-reset-test.js
const { execSync } = require('child_process');
const testConfig = require('../config/config.js').test;

console.log('=== RESTABLECIENDO BASE DE DATOS DE PRUEBAS ===');
console.log('Entorno:', process.env.NODE_ENV);
console.log('Configuración de test:', testConfig);
console.log(`DB: ${testConfig.database}, USER: ${testConfig.username}`);

async function runReset() {
  try {
    // 1. Eliminar DB si existe
    try {
      console.log(`Eliminando base de datos ${testConfig.database}...`);
      execSync('npx sequelize db:drop --env test', { stdio: 'inherit' });
    } catch (error) {
      console.log('La base de datos no existía o no pudo eliminarse, continuando...');
    }

    // 2. Crear nueva DB
    console.log(`Creando base de datos ${testConfig.database}...`);
    execSync('npx sequelize db:create --env test', { stdio: 'inherit' });

    // 3. Aplicar migraciones
    console.log('Aplicando migraciones...');
    execSync('npx sequelize db:migrate --env test', { stdio: 'inherit' });

    // 4. Sembrar datos
    console.log('Sembrando datos...');
    execSync('npx sequelize db:seed:all --env test --config config/config.js', { stdio: 'inherit' });
    
    console.log('✅ Base de datos de pruebas restablecida!');
  } catch (error) {
    console.error('❌ Error crítico:', error);
    process.exit(1);
  }
}

runReset();