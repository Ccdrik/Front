// script.js — accueil / recherche trajets avec gestion des erreurs token
import {
    isConnected,
    getRole,
    showAndHideElementsForRoles,
    getToken,
    handle401
} from "./auth/auth.js";

document.addEventListener('DOMContentLoaded', () => {
    showAndHideElementsForRoles();

    const API_BASE_URL = window.location.origin.includes('5500')
        ? 'http://127.0.0.1:8000/api'
        : 'http://127.0.0.1:8000/api';

    console.log("URL utilisée pour fetch:", API_BASE_URL);

    const form = document.querySelector("form");
    const resultContainer = document.getElementById("resultats-trajets");

    // Gestion de la soumission du formulaire
    form?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const depart = document.getElementById("depart").value.trim();
        const arrivee = document.getElementById("arrivee").value.trim();
        const date = document.getElementById("date").value;

        if (!depart || !arrivee || !date) {
            alert("Merci de remplir tous les champs !");
            return;
        }

        const searchUrl = `${API_BASE_URL}/trajets/search?villeDepart=${encodeURIComponent(depart)}&villeArrivee=${encodeURIComponent(arrivee)}&date=${encodeURIComponent(date)}`;

        try {
            const res = await fetch(searchUrl, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });

            if (handle401(res)) return;
            if (!res.ok) throw new Error("Erreur API");

            const data = await res.json();
            const trajets = data["hydra:member"] || data;

            resultContainer.innerHTML = "<h4 class='mb-3'>Résultats :</h4>";

            if (trajets.length === 0) {
                alert("😕 Aucun trajet trouvé pour ces critères !");
                resultContainer.innerHTML += `<p class="text-center text-muted">Aucun trajet trouvé pour ces critères.</p>`;
                return;
            }

            const ul = document.createElement("ul");
            ul.className = "list-group";

            trajets.forEach(trajet => {
                const li = document.createElement("li");
                li.className = "list-group-item";
                li.innerHTML = `
                    <strong>${trajet.villeDepart} → ${trajet.villeArrivee}</strong><br>
                    📅 ${trajet.dateDepart}<br>
                    🚘 ${trajet.nbPlaces} places disponibles<br>
                    💶 ${trajet.prix} €
                `;
                ul.appendChild(li);
            });

            resultContainer.appendChild(ul);
        } catch (error) {
            console.error("Erreur lors de la recherche :", error);
            resultContainer.innerHTML = `<p class="text-danger">Erreur lors de la recherche des trajets.</p>`;
        }
    });

    // Autocomplétion avec API adresse.data.gouv.fr
    setupAutocomplete("depart", "depart-suggestions");
    setupAutocomplete("arrivee", "arrivee-suggestions");

    const urlParams = new URLSearchParams(window.location.search);
    const preDepart = urlParams.get("depart");
    const preArrivee = urlParams.get("arrivee");
    const preDate = urlParams.get("date");

    const departInput = document.getElementById("depart");
    const arriveeInput = document.getElementById("arrivee");
    const dateInput = document.getElementById("date");

    if (departInput && arriveeInput && dateInput) {
        if (preDepart) departInput.value = preDepart;
        if (preArrivee) arriveeInput.value = preArrivee;
        if (preDate) dateInput.value = preDate;

        // Soumettre automatiquement le formulaire si tous les champs sont remplis
        if (preDepart && preArrivee && preDate) {
            form?.dispatchEvent(new Event("submit"));
        }
    } else {
        console.warn("Un ou plusieurs champs (depart, arrivee, date) sont introuvables dans cette page.");
    }
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