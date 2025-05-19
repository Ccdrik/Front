import { getToken } from './auth/auth.js';

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("tableau-trajets");
  if (!container) return;

  try {
    const token = getToken();
    const response = await fetch("http://localhost:8000/api/trajets", {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("Erreur récupération trajets");
    const data = await response.json();
    const trajets = data["hydra:member"] || data;

    container.innerHTML = ""; // vide le tableau

    trajets.forEach(trajet => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${trajet.depart}</td>
        <td>${trajet.arrivee}</td>
        <td>${trajet.date_depart}</td>
        <td>${trajet.heure_depart}</td>
        <td>${trajet.nb_places}</td>
        <td>${trajet.prix ?? '-'}</td>
        <td><button class="btn btn-primary btn-sm" onclick="voirDetail(${trajet.id})">Voir</button></td>
      `;
      container.appendChild(row);
    });

  } catch (error) {
    console.error(error);
    alert("Erreur lors du chargement des trajets");
  }
});

// Fonction pour rediriger vers la page détail / réservation
window.voirDetail = function (id) {
  localStorage.setItem("selectedTrajetId", id);
  window.location.href = "reservation.html";
};
