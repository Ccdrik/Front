// js/auth/auth.js

export const tokenCookieName = "accesstoken";
export const RoleCookiename = "role";

export function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = `${name}=${value || ""}${expires}; path=/`;
}

export function getCookie(name) {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
    for (let c of ca) {
        c = c.trim();
        if (c.indexOf(nameEQ) === 0) {
            return c.substring(nameEQ.length);
        }
    }
    return null;
}

export function setToken(token) {
    setCookie(tokenCookieName, token, 7);
}

export function isConnected() {
    const token = getCookie(tokenCookieName);
    return token !== null && token !== "";
}

export function getRole() {
    return getCookie(RoleCookiename);
}

export function showAndHideElementsForRoles() {
    const userConnected = isConnected();
    const role = getRole();
    const elements = document.querySelectorAll('[data-show]');
    elements.forEach(element => {
        switch (element.dataset.show) {
            case 'disconnected':
                if (userConnected) element.classList.add("d-none");
                break;
            case 'connected':
                if (!userConnected) element.classList.add("d-none");
                break;
            case 'passager':
                if (!userConnected || role !== "passager") element.classList.add("d-none");
                break;
            case 'chauffeur':
                if (!userConnected || role !== "chauffeur") element.classList.add("d-none");
                break;
            case 'admin':
                if (!userConnected || role !== "admin") element.classList.add("d-none");
                break;
            case 'employe':
                if (!userConnected || role !== "employe") element.classList.add("d-none");
                break;
        }
    });
}
