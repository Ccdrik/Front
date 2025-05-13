const tokenCookieName = "accesstoken";
const RoleCookiename = "role";
const signoutBtn = document.getElementById("signout-btn");

// Ajout d'un écouteur uniquement si le bouton existe
if (signoutBtn) {
    signoutBtn.addEventListener("click", signout);
}

// Gestion des cookies
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = `${name}=${value || ""}${expires}; path=/`;
}

function getCookie(name) {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length);
    }
    return null;
}

function eraseCookie(name) {
    document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
}

// Gestion de l'authentification
function getToken() {
    return getCookie(tokenCookieName);
}

function setToken(token) {
    setCookie(tokenCookieName, token, 7);
}

function getRole() {
    return getCookie(RoleCookiename);
}

function isConnected() {
    const token = getToken();
    return token !== null && token !== undefined && token !== "";
}

function signout() {
    eraseCookie(tokenCookieName);
    eraseCookie(RoleCookiename);
    window.location.reload();
}

// Gestion de l'affichage des éléments en fonction des rôles
function showAndHideElementsForRoles() {
    const userConnected = isConnected();
    const role = getRole();
    const allElementsToEdit = document.querySelectorAll('[data-show]');

    allElementsToEdit.forEach(element => {
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


document.addEventListener("DOMContentLoaded", showAndHideElementsForRoles);
