// test-env.js
process.env.NODE_ENV = 'test';
require('dotenv').config({ path: '.env.test' });

console.log('Directo desde dotenv:');
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_HOST:', process.env.DB_HOST);

console.log('\nDesde config:');
const config = require('./config/config');
console.log('Config test:', config.test);