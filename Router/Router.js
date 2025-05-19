// Router.js
import Route from "./Route.js";
import { allRoutes, websiteName } from "./allRoutes.js";
import { isConnected, getRole, showAndHideElementsForRoles } from "/js/auth/auth.js";

console.log("Rôle utilisateur :", getRole());
console.log("isConnected:", isConnected);

const route404 = new Route("404", "Page introuvable", "/pages/404.html", []);

// Récupère la route correspondant à l'URL actuelle
const getRouteByUrl = (url) => {
    return allRoutes.find(route => route.url === url) || route404;
};

const LoadContentPage = async () => {
    const path = window.location.pathname;
    const actualRoute = getRouteByUrl(path);

    // Gestion des autorisations selon les rôles définis dans la route
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
        // Chargement du contenu HTML de la page
        const html = await fetch(actualRoute.pathHtml).then(res => res.text());
        document.getElementById("main-page").innerHTML = html;

        // Chargement dynamique du module JavaScript associé
        if (actualRoute.pathJS) {
            try {
                const module = await import(actualRoute.pathJS);
                if (module && typeof module.default === "function") {
                    module.default();
                } else if (module.initSignupPage) {
                    module.initSignupPage();
                } else if (module.initSigninPage) {
                    module.initSigninPage();
                }
            } catch (e) {
                console.error("Erreur lors du chargement du module JS :", e);
            }
        } else {
            // En l'absence de module défini dans la route, on vérifie la route globale pour l'inscription ou la connexion
            if (path === "/signup") {
                const module = await import('../js/auth/signup.js');
                module.initSignupPage();
            } else if (path === "/signin") {
                const module = await import('../js/auth/signin.js');
                module.initSigninPage();
            }
        }

        // Mise à jour du titre de la page
        document.title = `${actualRoute.title} - ${websiteName}`;

        // Gestion de l'affichage des éléments en fonction du rôle
        showAndHideElementsForRoles();

    } catch (error) {
        console.error("Erreur lors du chargement de la page :", error);
        document.getElementById("main-page").innerHTML = "<p>Erreur de chargement de la page.</p>";
    }
};

document.body.addEventListener('click', (event) => {
    const target = event.target.closest('a');
    if (target && target.href && target.origin === window.location.origin) {
        event.preventDefault();
        window.history.pushState({}, '', target.pathname);
        LoadContentPage();
    }
});




const routeEvent = (event) => {
    event.preventDefault();
    window.history.pushState({}, "", event.target.href);
    LoadContentPage();
};


window.onpopstate = LoadContentPage;
window.route = routeEvent;

// Chargement initial de la page
LoadContentPage();
