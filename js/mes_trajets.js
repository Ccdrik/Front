import { getToken } from './auth/auth.js';

document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("tableau-trajets");
    if (!container) return;

    try {
        const token = getToken();
        const userId = localStorage.getItem("userId");
        if (!userId) throw new Error("Utilisateur non connecté");

        const response = await fetch(`http://localhost:8000/api/trajets?conducteur.id=${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Erreur récupération trajets");

        const data = await response.json();
        const trajets = data["hydra:member"] || data;

        container.innerHTML = "";

        trajets.forEach(trajet => {
            const row = document.createElement("tr");
            row.innerHTML = `
        <td>${trajet.depart}</td>
        <td>${trajet.arrivee}</td>
        <td>${trajet.date_depart}</td>
        <td>${trajet.heure_depart}</td>
        <td>${trajet.nb_places}</td>
        <td>${trajet.prix ?? '-'}</td>
        <td>
          <button class="btn btn-danger btn-sm" onclick="supprimerTrajet(${trajet.id})">Supprimer</button>
        </td>
      `;
            container.appendChild(row);
        });

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
});

window.supprimerTrajet = async function (id) {
    if (!confirm("Voulez-vous vraiment supprimer ce trajet ?")) return;

    try {
        const token = getToken();
        const response = await fetch(`http://localhost:8000/api/trajets/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Erreur suppression trajet");

        alert("Trajet supprimé !");
        window.location.reload();
    } catch (error) {
        console.error(error);
        alert("Erreur lors de la suppression");
    }
};
