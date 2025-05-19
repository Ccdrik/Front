import { tokenCookieName, roleCookieName } from './auth/auth.js';

if (document.getElementById("signout-btn")) {



    document.addEventListener('DOMContentLoaded', () => {
        const logoutBtn = document.getElementById("signout-btn");

        if (logoutBtn) {
            logoutBtn.addEventListener("click", () => {
                document.cookie = `${tokenCookieName}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
                document.cookie = `${roleCookieName}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
                alert("Déconnexion réussie !");
                window.location.href = "/signin.html";
            });
        }
    });
}