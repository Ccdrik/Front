import Route from "./Route.js";
import { allRoutes, websiteName } from "./allRoutes.js";
import { isConnected, getRole, showAndHideElementsForRoles } from "../js/auth/auth.js";

// Test d'importation
console.log("isConnected:", isConnected);

const route404 = new Route("404", "Page introuvable", "/pages/404.html", []);

const getRouteByUrl = (url) => {
    return allRoutes.find(route => route.url === url) || route404;
};

const LoadContentPage = async () => {
    const path = window.location.pathname;
    const actualRoute = getRouteByUrl(path);

    // Gestion des autorisations
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
        const html = await fetch(actualRoute.pathHtml).then(res => res.text());
        document.getElementById("main-page").innerHTML = html;

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
                console.error("Erreur lors du chargement JS :", e);
            }
        }

        document.title = `${actualRoute.title} - ${websiteName}`;
        showAndHideElementsForRoles();

    } catch (error) {
        console.error("Erreur lors du chargement de la page :", error);
        document.getElementById("main-page").innerHTML = "<p>Erreur de chargement de la page.</p>";
    }
};

const routeEvent = (event) => {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, "", event.target.href);
    LoadContentPage();
};

window.onpopstate = LoadContentPage;
window.route = routeEvent;

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
