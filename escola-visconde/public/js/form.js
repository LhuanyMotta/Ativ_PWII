document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Limpa mensagens de erro anteriores e classes
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
        el.classList.remove('show');
    });
    
    document.querySelectorAll('input, select, textarea').forEach(el => {
        el.classList.remove('error-field', 'success-field');
    });

    // Validação básica no front-end
    let isValid = true;
    const form = e.target;

    // Validar nome completo (pelo menos 2 palavras com 2+ caracteres cada)
    const nomeParts = form.nome.value.trim().split(/\s+/);
    if (nomeParts.length < 2 || nomeParts.some(part => part.length < 2)) {
        markFieldInvalid('nome', 'Por favor, insira seu nome completo (nome e sobrenome)');
        isValid = false;
    }

    // Validar e-mail
    if (!form.email.value.trim()) {
        markFieldInvalid('email', 'Por favor, insira um e-mail válido');
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.value)) {
        markFieldInvalid('email', 'Formato de e-mail inválido (exemplo: nome@dominio.com)');
        isValid = false;
    }

    // Validar telefone (mínimo 10 caracteres numéricos)
    const telefoneNumerico = form.telefone.value.replace(/\D/g, '');
    if (!form.telefone.value.trim() || telefoneNumerico.length < 10) {
        markFieldInvalid('telefone', 'Por favor, insira um telefone válido com DDD ex: (69) 91234-5678)');
        isValid = false;
    }

    // Validar data de nascimento (deve ser no passado)
    if (!form.data.value) {
        markFieldInvalid('data', 'Por favor, insira a data de nascimento');
        isValid = false;
    } else if (new Date(form.data.value) >= new Date()) {
        markFieldInvalid('data', 'Data de nascimento deve ser no passado');
        isValid = false;
    }

    // Validar série
    if (!form.serie.value) {
        markFieldInvalid('serie', 'Por favor, selecione uma série');
        isValid = false;
    }

    // Validar tipo de contato
    if (!document.querySelector('input[name="tipo-contato"]:checked')) {
        document.getElementById('tipo-contato-error').textContent = 'Por favor, selecione um tipo de contato';
        document.getElementById('tipo-contato-error').classList.add('show');
        isValid = false;
    }

    // Validar mensagem (mínimo 10 caracteres)
    if (!form.mensagem.value.trim() || form.mensagem.value.trim().length < 10) {
        markFieldInvalid('mensagem', 'Por favor, escreva sua mensagem (mínimo 10 caracteres)');
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    const formResult = document.getElementById('formResult');
    formResult.innerHTML = '<div class="loading">Enviando sua mensagem...</div>';
    formResult.style.display = 'block';

    try {
        const formData = {
            nome: form.nome.value.trim(),
            email: form.email.value.trim(),
            telefone: form.telefone.value.trim(),
            dataNascimento: form.data.value,
            serie: form.serie.value,
            tipoContato: document.querySelector('input[name="tipo-contato"]:checked').value,
            mensagem: form.mensagem.value.trim()
        };

        const response = await fetch('http://localhost:5000/api/contatos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erro ao enviar formulário');
        }

        formResult.innerHTML = `
            <div class="success">
                <h3>Contato enviado com sucesso!</h3>
                <p>Obrigado ${data.data.nome}, sua mensagem foi registrada.</p>
                <p>ID do contato: ${data.data.id}</p>
            </div>
        `;
        form.reset();
    } catch (error) {
        console.error('Erro no envio:', error);
        
        let errorMessage = error.message;
        if (error.message.includes('Validation error')) {
            errorMessage = 'Dados inválidos. Verifique os campos e tente novamente.';
        }

        formResult.innerHTML = `
            <div class="error">
                <h3>Erro ao enviar contato</h3>
                <p>${errorMessage}</p>
                <p>Tente novamente mais tarde.</p>
            </div>
        `;
    }
});

// Função auxiliar para marcar campos como inválidos
function markFieldInvalid(fieldId, errorMessage) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}-error`);
    
    field.classList.add('error-field');
    errorElement.textContent = errorMessage;
    errorElement.classList.add('show');
}

document.querySelectorAll('input, select, textarea').forEach(element => {
    element.addEventListener('input', function() {
        if (this.classList.contains('error-field')) {
            this.classList.remove('error-field');
            const errorElement = document.getElementById(`${this.id}-error`);
            if (errorElement) {
                errorElement.classList.remove('show');
            }
        }
    });
});

// Navegação suave para âncoras
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});