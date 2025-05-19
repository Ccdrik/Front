// js/home.js
import { getToken } from './auth/auth.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const resultats = document.getElementById('resultats-trajets');

    if (!form || !resultats) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        resultats.innerHTML = '<p>🔄 Recherche en cours...</p>';

        const depart = document.getElementById('depart').value;
        const arrivee = document.getElementById('arrivee').value;
        const date = document.getElementById('date').value;

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/trajets?depart=${depart}&destination=${arrivee}&date=${date}`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });

            if (!response.ok) throw new Error('Erreur lors du fetch');

            const trajets = await response.json();

            if (!Array.isArray(trajets) || trajets.length === 0) {
                resultats.innerHTML = `<div class="alert alert-warning">Aucun trajet trouvé pour ces critères.</div>`;
                return;
            }

            resultats.innerHTML = trajets.map(trajet => `
                <div class="card my-3">
                    <div class="card-body">
                        <h5 class="card-title">${trajet.chauffeur?.pseudo || 'Chauffeur inconnu'}</h5>
                        <p class="card-text">
                            🚗 Départ : <strong>${trajet.depart}</strong><br>
                            🏁 Arrivée : <strong>${trajet.destination}</strong><br>
                            📅 Date : ${trajet.dateDepart} à ${trajet.heureDepart}<br>
                            👥 Places restantes : ${trajet.placesDisponibles}<br>
                            💰 Prix : ${trajet.prix} crédits
                        </p>
                        <a href="#/trajet/${trajet.id}" class="btn btn-outline-success">Voir les détails</a>
                    </div>
                </div>
            `).join('');

        } catch (error) {
            console.error('Erreur lors de la recherche :', error);
            resultats.innerHTML = `<div class="alert alert-danger">Erreur lors de la recherche. Veuillez réessayer plus tard.</div>`;
        }
    });
});
