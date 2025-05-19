// signout.js
import { clearAuthCookies } from "./auth.js";

document.addEventListener("DOMContentLoaded", () => {
    const signoutBtn = document.getElementById("signout-btn");

    if (signoutBtn) {
        signoutBtn.addEventListener("click", () => {
            console.log("Déconnexion déclenchée");

            // Effacer les informations d'authentification (tokens, rôles, etc.)
            clearAuthCookies();

            // Optionnel : Si besoin, faites une requête vers le serveur pour invalider le token/session
            // fetch("http://127.0.0.1:8000/api/signout", { method: "POST" })
            //   .then(() => {
            //       window.location.replace("/signin");
            //   })
            //   .catch((err) => console.error("Erreur lors de l'appel serveur :", err));

            // Rediriger l'utilisateur vers la page de connexion
            window.location.replace("/signin");
        });
    } else {
        console.error("Le bouton de déconnexion n'a pas été trouvé dans le DOM.");
    }
});
