// js/trajet_detail.js
import { getToken } from './auth/auth.js';

document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('main.container'); // ciblage plus précis
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (!id) {
        container.innerHTML = `<div class="alert alert-danger">ID du trajet manquant dans l'URL.</div>`;
        return;
    }

    fetch(`http://127.0.0.1:8000/api/trajets/${id}`, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    })
        .then(response => {
            if (!response.ok) throw new Error("Erreur API");
            return response.json();
        })
        .then(trajet => {
            container.innerHTML = `
            <h2 class="mb-4 text-center">🚗 Détails du trajet</h2>
            <div class="card p-4">
                <h4>${trajet.depart} → ${trajet.destination}</h4>
                <p><strong>Date :</strong> ${trajet.dateDepart}</p>
                <p><strong>Heure de départ :</strong> ${trajet.heureDepart}</p>
                <p><strong>Conducteur :</strong> ${trajet.chauffeur?.pseudo || 'Anonyme'} (${trajet.chauffeur?.note || 'pas encore noté'})</p>
                <p><strong>Véhicule :</strong> ${trajet.vehicule?.marque || 'Inconnu'} ${trajet.vehicule?.modele || ''} - ${trajet.vehicule?.couleur || ''}</p>
                <p><strong>Énergie :</strong> ${trajet.vehicule?.energie || 'Non précisée'}</p>
                <p><strong>Places disponibles :</strong> ${trajet.placesDisponibles}</p>
                <p><strong>Prix par passager :</strong> ${trajet.prix} crédits</p>
                <hr />
                <button class="btn btn-success" id="btn-reserver">Réserver ce trajet</button>
            </div>
        `;

            document.getElementById('btn-reserver')?.addEventListener('click', () => {
                alert("Réservation en cours... (étape 1.3 à venir)");
            });
        })
        .catch(error => {
            console.error("Erreur :", error);
            container.innerHTML = `<div class="alert alert-danger text-center">❌ Erreur lors du chargement du trajet.</div>`;
        });
});
