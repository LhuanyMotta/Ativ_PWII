const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('escola_visconde', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306,
  logging: false,
  define: {
    timestamps: true,
    underscored: false
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

sequelize.authenticate()
  .then(() => console.log('✅ Conexão com o banco de dados estabelecida!'))
  .catch(err => console.error('❌ Erro na conexão com o banco:', err));

module.exports = sequelize;