const Contato = require('../models/Contato');

exports.criarContato = async (req, res) => {
    try {
        const { nome, email, telefone, dataNascimento, serie, tipoContato, mensagem } = req.body;
        
        if (!nome || !email || !telefone || !dataNascimento || !serie || !tipoContato || !mensagem) {
            return res.status(400).json({
                success: false,
                error: 'Todos os campos são obrigatórios'
            });
        }

        const nomeParts = nome.trim().split(/\s+/);
        if (nomeParts.length < 2 || nomeParts.some(part => part.length < 2)) {
            return res.status(400).json({
                success: false,
                error: 'Por favor, insira nome e sobrenome'
            });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                success: false,
                error: 'Formato de e-mail inválido'
            });
        }

        const telefoneNumerico = telefone.replace(/\D/g, '');
        if (telefoneNumerico.length < 10) {
            return res.status(400).json({
                success: false,
                error: 'Telefone deve conter pelo menos 10 dígitos (com DDD)'
            });
        }

        if (new Date(dataNascimento) >= new Date()) {
            return res.status(400).json({
                success: false,
                error: 'Data de nascimento deve ser no passado'
            });
        }

        if (mensagem.length < 10) {
            return res.status(400).json({
                success: false,
                error: 'Mensagem deve ter pelo menos 10 caracteres'
            });
        }

        const contato = await Contato.create({
            nome,
            email,
            telefone,
            dataNascimento,
            serie,
            tipoContato,
            mensagem
        });
        
        res.status(201).json({
            success: true,
            message: 'Contato criado com sucesso!',
            data: contato
        });
    } catch (error) {
        console.error('Erro ao criar contato:', error);
        
        let errorMessage = 'Erro ao processar solicitação';
        let errors = [];
        
        if (error.name === 'SequelizeValidationError') {
            errorMessage = 'Erro de validação';
            errors = error.errors.map(err => ({
                field: err.path,
                message: err.message
            }));
        }
        
        res.status(400).json({
            success: false,
            error: errorMessage,
            messages: errors.length ? errors : error.message
        });
    }
};

exports.listarContatos = async (req, res) => {
    try {
        const contatos = await Contato.findAll({
            order: [['createdAt', 'DESC']]
        });
        
        res.json({
            success: true,
            data: contatos
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erro ao buscar contatos',
            message: error.message
        });
    }
};