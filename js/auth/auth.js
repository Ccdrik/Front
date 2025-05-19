// js/auth/auth.js — centralise la logique par rôle

export const tokenCookieName = "accesstoken";
export const roleCookieName = "role";

export function setCookie(name, value, days = 7) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

export function getCookie(name) {
    return document.cookie
        .split("; ")
        .find(row => row.startsWith(name + "="))
        ?.split("=")[1] ?? null;
}

export function setToken(token) {
    setCookie(tokenCookieName, token);
}

export function getToken() {
    const match = document.cookie.match(new RegExp(`(^| )${tokenCookieName}=([^;]+)`));
    return match ? match[2] : null;
}

export function clearAuthCookies() {
    setCookie(tokenCookieName, '', -1);
    setCookie(roleCookieName, '', -1);
}

export function isConnected() {
    const token = getToken();
    return token !== null && token !== "";
}

export function setRole(role) {
    setCookie(roleCookieName, role);
}

export function getRole() {
    return getCookie(roleCookieName);
}

export function showAndHideElementsForRoles() {
    const connected = isConnected();
    const role = getRole();
    console.log("Rôle utilisateur :", role);
    console.log("isConnected:", isConnected);

    document.querySelectorAll('[data-show]').forEach(el => {
        const showCondition = el.dataset.show;
        const shouldHide =
            (showCondition === 'disconnected' && connected) ||
            (showCondition === 'connected' && !connected) ||
            (["passager", "chauffeur", "admin", "employe"].includes(showCondition) && (!connected || role !== showCondition));
        el.classList.toggle("d-none", shouldHide);
    });
}

export function handle401(response) {
    if (response.status === 401) {
        console.warn("Token expiré ou invalide, suppression des cookies et redirection.");
        clearAuthCookies();
        window.location.href = "/signin";
        return true;
    }
    return false;
}

// Gestion du bouton de déconnexion
document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("signout-btn");
    if (!logoutBtn) return;

    logoutBtn.addEventListener("click", () => {
        clearAuthCookies();
        alert("Déconnexion réussie !");
        window.location.href = "/signin"; // Redirection vers la page de connexion
    });
});
