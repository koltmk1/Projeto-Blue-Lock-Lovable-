const formularioCadastro = document.getElementById("formCadastro");

if (formularioCadastro) {
    formularioCadastro.addEventListener("submit", async function (event) {
        event.preventDefault();
        const nome = document.getElementById("nome").value.trim();
        const email = document.getElementById("email").value.trim().toLowerCase();
        const senha = document.getElementById("senha").value;
        const confirmarSenha = document.getElementById("confirmarSenha").value;
        const mensagem = document.getElementById("mensagem-cadastro");
        const botao = formularioCadastro.querySelector('button[type="submit"]');

        if (senha !== confirmarSenha) {
            mensagem.textContent = "As senhas não são iguais.";
            mensagem.style.color = "#ff5c69";
            return;
        }
        if (senha.length < 6) {
            mensagem.textContent = "A senha precisa ter pelo menos 6 caracteres.";
            mensagem.style.color = "#ff5c69";
            return;
        }

        const usuarios = BLStorage.getUsers();
        if (usuarios.some(usuario => usuario.email === email)) {
            mensagem.textContent = "Este e-mail já está cadastrado.";
            mensagem.style.color = "#ff5c69";
            return;
        }

        botao.disabled = true;
        const senhaHash = await BLStorage.hashPassword(senha);
        usuarios.push(BLStorage.normalizeUser({
            id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`,
            nome,
            email,
            senhaHash,
            diamantes: 7000,
            jogadores: [],
            escalacao: {},
            partidas: { jogadas: 0, vitorias: 0, derrotas: 0, empates: 0 }
        }));
        BLStorage.saveUsers(usuarios);
        mensagem.textContent = "Conta criada com 7.000 diamantes!";
        mensagem.style.color = "#35e5a1";
        setTimeout(() => { window.location.href = "entrar-conta.html"; }, 700);
    });
}
