// js/auth/auth.js

// === CONSTANTES ===
export const tokenCookieName = "token";
export const roleCookieName = "role";

// === COOKIES ===
export function setCookie(name, value, days = 1) {
    const expires = new Date(Date.now() + days * 86400000).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

export function getCookie(name) {
    const cookies = document.cookie.split(";").map(c => c.trim());
    const cookie = cookies.find(c => c.startsWith(`${name}=`));
    return cookie ? cookie.split("=")[1] : null;
}

export function deleteCookie(name) {
    document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
}

// === TOKENS ===
export function setToken(token) {
    setCookie(tokenCookieName, token);
}

export function getToken() {
    return getCookie(tokenCookieName);
}

export function deleteToken() {
    deleteCookie(tokenCookieName);
}

// === ROLES ===
export function setRole(role) {
    setCookie(roleCookieName, role);
}

export function getRole() {
    return getCookie(roleCookieName);
}

export function deleteRole() {
    deleteCookie(roleCookieName);
}

// === ÉTAT DE CONNEXION ===
export function isConnected() {
    return !!getToken();
}

// === AFFICHAGE DES ÉLÉMENTS SELON LE RÔLE ===
export function showAndHideElementsForRoles() {
    const role = getRole();

    document.querySelectorAll("[data-show]").forEach(elem => {
        const showCondition = elem.getAttribute("data-show");

        if (
            (showCondition === "connected" && isConnected()) ||
            (showCondition === "disconnected" && !isConnected()) ||
            (showCondition === role)
        ) {
            elem.style.display = "";
        } else {
            elem.style.display = "none";
        }
    });
}
