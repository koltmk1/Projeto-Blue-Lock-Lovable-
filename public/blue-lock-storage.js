(function () {
    "use strict";

    const USERS_KEY = "usuariosBlueLock";
    const SESSION_KEY = "blueLockSessao";
    const LEGACY_SESSION_KEY = "usuarioAtual";

    function parse(value, fallback) {
        try { return value ? JSON.parse(value) : fallback; } catch (_) { return fallback; }
    }

    function getUsers() {
        const users = parse(localStorage.getItem(USERS_KEY), []);
        return Array.isArray(users) ? users : [];
    }

    function saveUsers(users) {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    async function hashPassword(password) {
        if (!window.crypto || !window.crypto.subtle) return password;
        const bytes = new TextEncoder().encode(password);
        const digest = await window.crypto.subtle.digest("SHA-256", bytes);
        return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
    }

    function normalizeUser(user) {
        return {
            ...user,
            id: user.id || (crypto.randomUUID ? crypto.randomUUID() : String(Date.now())),
            diamantes: Number.isFinite(Number(user.diamantes)) ? Number(user.diamantes) : 0,
            jogadores: Array.isArray(user.jogadores) ? user.jogadores : [],
            escalacao: user.escalacao && typeof user.escalacao === "object" ? user.escalacao : {},
            partidas: user.partidas && typeof user.partidas === "object" ? user.partidas : { jogadas: 0, vitorias: 0, derrotas: 0, empates: 0 }
        };
    }

    function getCurrent() {
        const sessionId = localStorage.getItem(SESSION_KEY);
        const users = getUsers();
        let user = users.find(item => item.id === sessionId);
        if (!user) {
            const legacy = parse(localStorage.getItem(LEGACY_SESSION_KEY), null);
            user = legacy ? users.find(item => item.id === legacy.id || item.email === legacy.email) : null;
        }
        return user ? normalizeUser(user) : null;
    }

    function updateCurrent(changes) {
        const current = getCurrent();
        if (!current) return null;
        const users = getUsers();
        const index = users.findIndex(item => item.id === current.id);
        if (index < 0) return null;
        users[index] = normalizeUser({ ...users[index], ...changes });
        saveUsers(users);
        localStorage.setItem(SESSION_KEY, users[index].id);
        localStorage.setItem(LEGACY_SESSION_KEY, JSON.stringify(users[index]));
        return users[index];
    }

    function signIn(user) {
        const normalized = normalizeUser(user);
        localStorage.setItem(SESSION_KEY, normalized.id);
        localStorage.setItem("usuarioLogado", "true");
        localStorage.setItem(LEGACY_SESSION_KEY, JSON.stringify(normalized));
        return normalized;
    }

    function signOut() {
        localStorage.removeItem(SESSION_KEY);
        localStorage.removeItem("usuarioLogado");
        localStorage.removeItem(LEGACY_SESSION_KEY);
    }

    window.BLStorage = { getUsers, saveUsers, hashPassword, normalizeUser, getCurrent, updateCurrent, signIn, signOut };
}());
