import { getToken } from './auth/auth.js';

document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("tableau-reservations");
    if (!container) return;

    try {
        const token = getToken();
        const userId = localStorage.getItem("userId");
        if (!userId) throw new Error("Utilisateur non connecté");

        const response = await fetch(`http://localhost:8000/api/reservations?passager.id=${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Erreur récupération réservations");

        const data = await response.json();
        const reservations = data["hydra:member"] || data;

        container.innerHTML = "";

        reservations.forEach(reservation => {
            const trajet = reservation.trajet;
            const row = document.createElement("tr");
            row.innerHTML = `
        <td>${trajet.depart}</td>
        <td>${trajet.arrivee}</td>
        <td>${trajet.date_depart}</td>
        <td>${trajet.heure_depart}</td>
        <td>${trajet.nb_places}</td>
        <td>${trajet.prix ?? '-'}</td>
      `;
            container.appendChild(row);
        });

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
});
