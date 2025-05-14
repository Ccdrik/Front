// js/script.js
import {
    isConnected,
    getRole,
    showAndHideElementsForRoles,
    tokenCookieName,
    RoleCookiename
} from './auth/auth.js';

const signoutBtn = document.getElementById('signout-btn');

function signout() {
    document.cookie = `${tokenCookieName}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
    document.cookie = `${RoleCookiename}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
    window.location.reload();
}

if (signoutBtn) {
    signoutBtn.addEventListener('click', signout);
}

document.addEventListener('DOMContentLoaded', showAndHideElementsForRoles);