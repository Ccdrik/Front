// script.js — accueil / recherche trajets avec gestion des erreurs token
import {
    isConnected,
    getRole,
    showAndHideElementsForRoles,
    tokenCookieName,
    roleCookieName,
    getToken,
    handle401
} from "./auth/auth.js";

document.addEventListener('DOMContentLoaded', () => {
    showAndHideElementsForRoles();

    const API_BASE_URL = window.location.origin.includes('5500')
        ? 'http://127.0.0.1:8000/api'
        : 'http://127.0.0.1:8000/api';

    console.log("URL utilisée pour fetch:", API_BASE_URL);

    fetch(`${API_BASE_URL}/trajets`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`
        }
    })
        .then(async response => {
            console.log("Statut de la réponse:", response.status);
            if (handle401(response)) return;

            const text = await response.text();
            try {
                const json = JSON.parse(text);
                return json;
            } catch (e) {
                console.error("❌ JSON.parse a échoué :", e);
                console.warn("Contenu brut de la réponse :", text);
                throw new Error("Réponse invalide reçue du serveur");
            }
        })
        .then(data => {
            if (!data) return;
            console.log("✅ Données reçues:", data);

            const trajets = data["hydra:member"] || data;
            const container = document.getElementById('trajets');
            if (!container) return;

            trajets.forEach(trajet => {
                const li = document.createElement('li');
                li.textContent = `Départ : ${trajet.villeDepart} → Arrivée : ${trajet.villeArrivee}`;
                container.appendChild(li);
            });
        })
        .catch(error => {
            console.error("Erreur lors du fetch des trajets:", error);
            const container = document.getElementById('trajets');
            if (container) {
                container.innerHTML = `<li class="text-danger">Impossible de charger les trajets.</li>`;
            }
        });

    setupAutocomplete("depart", "depart-suggestions");
    setupAutocomplete("arrivee", "arrivee-suggestions");
});

function setupAutocomplete(inputId, datalistId) {
    const input = document.getElementById(inputId);
    const datalist = document.getElementById(datalistId);

    if (!input || !datalist) return;

    input.addEventListener("input", async () => {
        const query = input.value.trim();
        if (query.length < 3) {
            datalist.innerHTML = "";
            return;
        }
        try {
            const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=5`);
            const data = await response.json();
            datalist.innerHTML = "";
            data.features.forEach(feature => {
                const option = document.createElement("option");
                option.value = feature.properties.label;
                datalist.appendChild(option);
            });
        } catch (error) {
            console.error("Erreur autocomplétion adresse :", error);
        }
    });
}
