// Router.js — version corrigée et prête à l'emploi

import { allRoutes, websiteName } from "./allRoutes.js";
import Route from "./Route.js";
import { getRole, isConnected, showAndHideElementsForRoles } from "../js/auth/auth.js";

// Chargement initial après DOM prêt
document.addEventListener("DOMContentLoaded", () => {
    // Redirige /index.html vers / pour normaliser l'URL
    if (window.location.pathname === "/index.html") {
        history.replaceState({}, "", "/");
    }

    initRouter();
    window.addEventListener("popstate", routerNavigation);
});

function initRouter() {
    // Interception des clics sur les liens data-link
    document.body.addEventListener("click", async (event) => {
        const target = event.target.closest("a");

        if (target && target.matches("[data-link]")) {
            event.preventDefault();
            const path = target.getAttribute("href");
            if (path) {
                history.pushState({}, "", path);
                await routerNavigation();
            }
        }
    });

    // Exécution immédiate de la première route
    routerNavigation();
}

async function routerNavigation() {
    const path = window.location.pathname;
    const cleanedPath = path === "/index.html" ? "/" : path;
    const route = allRoutes.find((r) => r.path === cleanedPath);

    if (!route) {
        return displayNotFound();
    }

    // Sécurité : rôle requis ?
    if (route.roles && route.roles.length > 0) {
        const role = getRole();
        if (!isConnected() || !role || !route.roles.includes(role)) {
            alert("Accès non autorisé");
            history.pushState({}, "", "/signin");
            await routerNavigation();
            return;
        }
    }

    try {
        const res = await fetch(route.pathHtml);
        if (!res.ok) throw new Error("Fichier HTML introuvable");
        const html = await res.text();
        const app = document.getElementById("app");
        if (!app) throw new Error("Élément #app manquant dans index.html");

        app.innerHTML = html;
        document.title = `${route.title} - ${websiteName}`;

        showAndHideElementsForRoles();

        // Chargement JS spécifique à la route
        if (route.pathJS) {
            try {
                const module = await import(`${route.pathJS}`);

                if (typeof module.default === "function") {
                    module.default();
                } else {
                    const routeName = extractNameFromPath(route.path);
                    const initFuncName = `init${capitalizeFirstLetter(routeName)}Page`;
                    if (typeof module[initFuncName] === "function") {
                        module[initFuncName]();
                    }
                }
            } catch (err) {
                console.error("Erreur lors du chargement JS de la route:", err);
            }
        }
    } catch (err) {
        console.error("Erreur navigation:", err);
        displayNotFound();
    }
}

function displayNotFound() {
    const app = document.getElementById("app");
    if (!app) return;
    app.innerHTML = `
        <div class="container py-5 text-center">
            <h1 class="display-4">404</h1>
            <p class="lead">Page introuvable</p>
            <a href="/" data-link class="btn btn-primary">Retour à l'accueil</a>
        </div>
    `;
    document.title = `404 - ${websiteName}`;
}

function extractNameFromPath(path) {
    const trimmed = path.replace("/", "");
    return trimmed || "Home";
}

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
