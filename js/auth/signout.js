// signout.js
import { clearAuthCookies } from "./auth.js";

document.addEventListener("DOMContentLoaded", () => {
    const signoutBtn = document.getElementById("signout-btn");

    if (signoutBtn) {
        signoutBtn.addEventListener("click", () => {
            console.log("Déconnexion déclenchée");

            clearAuthCookies();

            window.history.pushState({}, '', '/signin');
            dispatchEvent(new PopStateEvent('popstate'));
        });
    } else {
        console.error("Le bouton de déconnexion n'a pas été trouvé dans le DOM.");
    }
});
