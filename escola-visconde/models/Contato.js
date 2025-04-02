const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Contato = sequelize.define('Contato', {
    nome: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'O nome é obrigatório'
            },
            len: {
                args: [3, 100],
                msg: 'O nome deve ter entre 3 e 100 caracteres'
            },
            isFullName(value) {
                const parts = value.trim().split(/\s+/);
                if (parts.length < 2 || parts.some(part => part.length < 2)) {
                    throw new Error('Por favor, insira nome e sobrenome');
                }
            }
        }
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'O email é obrigatório'
            },
            isEmail: {
                msg: 'Por favor, insira um email válido'
            }
        }
    },
    telefone: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'O telefone é obrigatório'
            },
            len: {
                args: [10, 20],
                msg: 'O telefone deve ter entre 10 e 20 caracteres'
            }
        }
    },
    dataNascimento: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'A data de nascimento é obrigatória'
            },
            isDate: {
                msg: 'Por favor, insira uma data válida'
            },
            isBefore: {
                args: new Date().toISOString(),
                msg: 'A data de nascimento deve ser no passado'
            }
        }
    },
    serie: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'A série é obrigatória'
            }
        }
    },
    tipoContato: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'O tipo de contato é obrigatório'
            },
            isIn: {
                args: [['matricula', 'duvida', 'reclamacao', 'elogio']],
                msg: 'Tipo de contato inválido'
            }
        }
    },
    mensagem: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'A mensagem é obrigatória'
            },
            len: {
                args: [10, 2000],
                msg: 'A mensagem deve ter entre 10 e 2000 caracteres'
            }
        }
    }
}, {
    tableName: 'contatos',
    timestamps: true
});

module.exports = Contato;