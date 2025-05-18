export const tokenCookieName = "accesstoken";
export const RoleCookieName = "role";

// Gestion des cookies
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

// Gestion du token
export function setToken(token) {
    setCookie(tokenCookieName, token);
}

export function getToken() {
    const match = document.cookie.match(new RegExp(`(^| )${tokenCookieName}=([^;]+)`));
    return match ? match[2] : null;
}

export function isConnected() {
    const token = getToken();
    return token !== null && token !== "";
}

// Gestion du rôle
export function setRole(role) {
    setCookie(RoleCookieName, role);
}

export function getRole() {
    return getCookie(RoleCookieName);
}

// Affichage conditionnel en fonction du rôle
export function showAndHideElementsForRoles() {
    const connected = isConnected();
    const role = getRole();
    document.querySelectorAll('[data-show]').forEach(el => {
        const showCondition = el.dataset.show;
        const shouldHide =
            (showCondition === 'disconnected' && connected) ||
            (showCondition === 'connected' && !connected) ||
            (['passager', 'chauffeur', 'admin', 'employe'].includes(showCondition) && (!connected || role !== showCondition));
        el.classList.toggle("d-none", shouldHide);
    });
}
