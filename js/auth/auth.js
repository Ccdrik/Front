// js/auth/auth.js — centralise la logique par rôle

export const tokenCookieName = "accesstoken";
export const roleCookieName = "role";

export function setCookie(name, value, days = 7) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

export function getCookie(name) {
    return document.cookie
        .split("; ")
        .find(row => row.startsWith(name + "="))
        ?.split("=")[1] ?? null;
}

export function setToken(token) {
    setCookie(tokenCookieName, token);
}

export function getToken() {
    const match = document.cookie.match(new RegExp(`(^| )${tokenCookieName}=([^;]+)`));
    return match ? match[2] : null;
}

export function isConnected() {
    const token = getToken();
    return token !== null && token !== "";
}

export function setRole(role) {
    setCookie(roleCookieName, role);
}

export function getRole() {
    return getCookie(roleCookieName);
}

export function showAndHideElementsForRoles() {
    const connected = isConnected();
    const role = getRole();
    document.querySelectorAll('[data-show]').forEach(el => {
        const showCondition = el.dataset.show;
        const shouldHide =
            (showCondition === 'disconnected' && connected) ||
            (showCondition === 'connected' && !connected) ||
            (['passager', 'chauffeur', 'admin', 'employe'].includes(showCondition) && (!connected || role !== showCondition));
        el.classList.toggle("d-none", shouldHide);
    });

    if (connected && role) {
        switch (role) {
            case "admin":
                afficherInfosAdmin();
                break;
            case "chauffeur":
                afficherInfosChauffeur();
                break;
            case "passager":
                afficherInfosPassager();
                break;
            case "employe":
                afficherInfosEmploye();
                break;
        }
    }
}

function afficherInfosAdmin() {
    const badge = document.createElement('div');
    badge.textContent = "👑 Vous êtes connecté en tant qu'administrateur";
    badge.className = "alert alert-info text-center mt-3";
    document.body.prepend(badge);

    const container = document.createElement("div");
    container.className = "container mt-4";
    container.innerHTML = `
        <h2>Utilisateurs inscrits</h2>
        <ul id="liste-utilisateurs" class="list-group"></ul>
    `;
    document.body.appendChild(container);

    fetch("http://127.0.0.1:8000/api/users", {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    })
        .then(res => res.json())
        .then(data => {
            const ul = document.getElementById("liste-utilisateurs");
            data.forEach(user => {
                const li = document.createElement("li");
                li.className = "list-group-item d-flex justify-content-between";
                li.innerHTML = `<span>${user.pseudo} (${user.email})</span> <span>${user.credits ?? 0} crédits</span>`;
                ul.appendChild(li);
            });
        });
}

function afficherInfosChauffeur() {
    const info = document.createElement("div");
    info.textContent = "🚗 Bienvenue, chauffeur ! Voici vos trajets";
    info.className = "alert alert-warning text-center mt-3";
    document.body.prepend(info);

    const container = document.createElement("div");
    container.className = "container mt-4";
    container.innerHTML = `
        <h2>Mes trajets</h2>
        <ul id="liste-trajets" class="list-group"></ul>
    `;
    document.body.appendChild(container);

    fetch("http://127.0.0.1:8000/api/trajets?conducteur.id=me", {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    })
        .then(res => res.json())
        .then(data => {
            const ul = document.getElementById("liste-trajets");
            (data["hydra:member"] || data).forEach(trajet => {
                const li = document.createElement("li");
                li.className = "list-group-item";
                li.textContent = `${trajet.villeDepart} → ${trajet.villeArrivee} - ${trajet.dateDepart}`;
                ul.appendChild(li);
            });
        });
}

function afficherInfosPassager() {
    const message = document.createElement("div");
    message.textContent = "🧳 Bonjour cher passager ! Voici vos réservations";
    message.className = "alert alert-success text-center mt-3";
    document.body.prepend(message);

    const container = document.createElement("div");
    container.className = "container mt-4";
    container.innerHTML = `
        <h2>Mes réservations</h2>
        <ul id="liste-reservations" class="list-group"></ul>
    `;
    document.body.appendChild(container);

    fetch("http://127.0.0.1:8000/api/mes-reservations", {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    })
        .then(res => res.json())
        .then(data => {
            const ul = document.getElementById("liste-reservations");
            data.forEach(reservation => {
                const trajet = reservation.trajet;
                const li = document.createElement("li");
                li.className = "list-group-item";
                li.textContent = `${trajet.villeDepart} → ${trajet.villeArrivee} - ${trajet.dateDepart}`;
                ul.appendChild(li);
            });
        });
}

function afficherInfosEmploye() {
    const info = document.createElement("div");
    info.textContent = "🛠️ Chargement des trajets à valider...";
    info.className = "alert alert-secondary text-center mt-3";
    document.body.prepend(info);

    const container = document.createElement("div");
    container.className = "container mt-4";
    container.innerHTML = `
        <h2>Trajets à valider</h2>
        <ul id="trajets-a-valider" class="list-group"></ul>
    `;
    document.body.appendChild(container);

    fetch("http://127.0.0.1:8000/api/trajets?status=attente", {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    })
        .then(res => res.json())
        .then(data => {
            const list = document.getElementById("trajets-a-valider");
            list.innerHTML = "";

            (data["hydra:member"] || data).forEach(trajet => {
                const li = document.createElement("li");
                li.className = "list-group-item d-flex justify-content-between align-items-center";
                li.innerHTML = `
                    <span>${trajet.villeDepart} → ${trajet.villeArrivee} - ${trajet.dateDepart}</span>
                    <button class="btn btn-success btn-sm">Valider</button>
                `;
                list.appendChild(li);
            });
        })
        .catch(err => {
            console.error("Erreur fetch trajets à valider:", err);
            document.getElementById("trajets-a-valider").innerHTML =
                '<li class="list-group-item text-danger">Erreur lors du chargement des trajets.</li>';
        });
}