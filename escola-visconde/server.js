const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/database');
const contatoRoutes = require('./routes/contatoRoutes');

const app = express();

app.use(cors({
  origin: '*'
}));

app.use(bodyParser.json());
app.use(express.static('public'));

app.use('/api/contatos', contatoRoutes);

app.get('/', (req, res) => {
  res.send('API da Escola Visconde do Rio Branco está funcionando!');
});

app.use((err, req, res, next) => {
  console.error('Erro global:', err.stack);
  res.status(500).json({ 
    success: false,
    error: 'Erro interno do servidor',
    message: err.message 
  });
});

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com MySQL estabelecida!');
    
    await sequelize.sync({ alter: true });
    console.log('🔄 Modelos sincronizados com o banco');
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`🔗 Acesse: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Falha na inicialização:', error);
    process.exit(1);
  }
};

startServer();