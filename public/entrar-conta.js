const formularioLogin = document.getElementById("formLogin");

if (formularioLogin) {
    formularioLogin.addEventListener("submit", async function (event) {
        event.preventDefault();
        const email = document.getElementById("email").value.trim().toLowerCase();
        const senha = document.getElementById("senha").value;
        const mensagem = document.getElementById("mensagem-login");
        const usuarios = BLStorage.getUsers();
        const usuario = usuarios.find(item => item.email === email);

        if (!usuario) {
            mensagem.textContent = usuarios.length ? "E-mail ou senha incorretos." : "Nenhuma conta foi cadastrada ainda.";
            mensagem.style.color = "#ff5c69";
            return;
        }

        const senhaHash = await BLStorage.hashPassword(senha);
        const senhaValida = usuario.senhaHash ? usuario.senhaHash === senhaHash : usuario.senha === senha;
        if (!senhaValida) {
            mensagem.textContent = "E-mail ou senha incorretos.";
            mensagem.style.color = "#ff5c69";
            return;
        }

        if (!usuario.senhaHash) {
            usuario.senhaHash = senhaHash;
            delete usuario.senha;
            BLStorage.saveUsers(usuarios);
        }
        BLStorage.signIn(usuario);
        mensagem.textContent = "Login realizado com sucesso!";
        mensagem.style.color = "#35e5a1";
        setTimeout(() => { window.location.href = "Inicial.html"; }, 500);
    });
}
