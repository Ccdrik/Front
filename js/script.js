import {
    isConnected,
    getRole,
    showAndHideElementsForRoles,
    tokenCookieName,
    roleCookieName,
    getToken
} from './auth/auth.js';

document.addEventListener('DOMContentLoaded', () => {
    showAndHideElementsForRoles();

    // Fetch des trajets avec token dans header
    fetch('http://127.0.0.1:8000/api/trajets', {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`
        }
    })
        .then(response => {
            if (!response.ok) throw new Error('Erreur de la requête');
            return response.json();
        })
        .then(data => {
            const container = document.getElementById('trajets');
            if (!container) return;

            data.forEach(trajet => {
                const li = document.createElement('li');
                li.textContent = `Départ : ${trajet.depart} → Arrivée : ${trajet.destination}`;
                container.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Erreur lors du fetch des trajets:', error);
            const container = document.getElementById('trajets');
            if (container) {
                container.innerHTML = `<li class="text-danger">Impossible de charger les trajets.</li>`;
            }
        });

    // Initialisation autocomplétions départ et arrivée
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
            datalist.innerHTML = ""; // pas de suggestions si trop court
            return;
        }
        try {
            const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=5`);
            const data = await response.json();
            datalist.innerHTML = ""; // vider anciennes suggestions
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
