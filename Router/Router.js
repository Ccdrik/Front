import Route from "./Route.js";
import { allRoutes, websiteName } from "./allRoutes.js";

import { isConnected, getRole, showAndHideElementsForRoles } from "../js/auth/auth.js";

// Route 404 (page introuvable)
const route404 = new Route("404", "Page introuvable", "/pages/404.html", []);

// Récupère la route correspondant à une URL
const getRouteByUrl = (url) => {
    return allRoutes.find(route => route.url === url) || route404;
};

// Charge dynamiquement le contenu d’une page
const LoadContentPage = async () => {
    const path = window.location.pathname;
    const actualRoute = getRouteByUrl(path);

    // Gérer les autorisations
    const allRolesArray = actualRoute.authorize;
    if (allRolesArray.length > 0) {
        if (allRolesArray.includes("disconnected")) {
            if (isConnected()) {
                window.location.replace("/");
                return;
            }
        } else {
            const roleUser = getRole();
            if (!allRolesArray.includes(roleUser)) {
                window.location.replace("/");
                return;
            }
        }
    }

    try {
        // Charger le HTML de la page
        const html = await fetch(actualRoute.pathHtml).then(res => res.text());
        document.getElementById("main-page").innerHTML = html;

        // Charger dynamiquement le JS associé, si besoin
        if (actualRoute.pathJS) {
            try {
                const module = await import(actualRoute.pathJS);
                if (module && typeof module.default === "function") {
                    module.default(); // Si module exporte une fonction par défaut
                } else if (module.initSignupPage) {
                    module.initSignupPage(); // Exemple : page d'inscription
                } else if (module.initSigninPage) {
                    module.initSigninPage(); // Exemple : page de connexion
                }
            } catch (e) {
                console.error("Erreur lors du chargement JS :", e);
            }
        }

        // Mettre à jour le titre
        document.title = `${actualRoute.title} - ${websiteName}`;

        // Gérer affichage selon rôles
        showAndHideElementsForRoles();

    } catch (error) {
        console.error("Erreur lors du chargement de la page :", error);
        document.getElementById("main-page").innerHTML = "<p>Erreur de chargement de la page.</p>";
    }
};

// Gère les événements de navigation (liens)
const routeEvent = (event) => {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, "", event.target.href);
    LoadContentPage();
};

// Événement retour arrière
window.onpopstate = LoadContentPage;
window.route = routeEvent;

// Chargement initial
LoadContentPage();



const path = window.location.pathname;

if (path === "/signup") {
    import('../js/auth/signup.js').then(module => {
        module.initSignupPage();
    });
} else if (path === "/signin") {
    import('../js/auth/signin.js').then(module => {
        module.initSigninPage();
    });
}