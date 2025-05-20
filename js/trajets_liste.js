// js/trajets_liste.js
import {
  isConnected,
  getToken,
  handle401,
  showAndHideElementsForRoles
} from "./auth/auth.js";

document.addEventListener("DOMContentLoaded", () => {
  showAndHideElementsForRoles();
  initTrajetsListePage();
});

export async function initTrajetsListePage() {
  const API_BASE_URL = "http://127.0.0.1:8000/api";
  const container = document.getElementById("liste-trajets");

  if (!container) {
    console.warn("Conteneur #liste-trajets non trouvé");
    return;
  }

  container.innerHTML = `<p class="text-muted">🔄 Chargement des trajets...</p>`;

  try {
    const res = await fetch(`${API_BASE_URL}/trajets`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });

    if (handle401(res)) return;
    if (!res.ok) throw new Error("Erreur lors du chargement des trajets");

    const data = await res.json();
    const trajets = data["hydra:member"] || data;

    if (trajets.length === 0) {
      container.innerHTML = `<p class="text-muted">Aucun trajet disponible pour le moment.</p>`;
      return;
    }

    container.innerHTML = "";

    trajets.forEach(trajet => {
      const card = document.createElement("div");
      card.className = "card mb-3";

      const placesRestantes = trajet.places - (trajet.reservations?.reduce((acc, r) => acc + r.places, 0) || 0);
      const dejaReserve = trajet.reservations?.some(r => r.user.id === getUserId()) ?? false;

      card.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${trajet.villeDepart} → ${trajet.villeArrivee}</h5>
                    <p class="card-text">📅 ${trajet.dateDepart}</p>
                    <p class="card-text">🚘 ${placesRestantes} place(s) restante(s)</p>
                    <p class="card-text">💶 ${trajet.prix} €</p>
                    ${dejaReserve
          ? `<button class="btn btn-secondary" disabled>Déjà réservé</button>`
          : placesRestantes > 0
            ? `<button class="btn btn-primary btn-reserver" data-trajet-id="${trajet.id}">Réserver</button>`
            : `<button class="btn btn-danger" disabled>Complet</button>`
        }
                </div>
            `;

      container.appendChild(card);
    });

    // Boutons "Réserver"
    document.querySelectorAll(".btn-reserver").forEach(button => {
      button.addEventListener("click", async () => {
        const trajetId = button.dataset.trajetId;

        try {
          const res = await fetch(`${API_BASE_URL}/reservations`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getToken()}`
            },
            body: JSON.stringify({ trajetId })
          });

          const responseData = await res.json();

          if (handle401(res)) return;
          if (!res.ok) {
            const msg = responseData.message || "Erreur lors de la réservation.";
            alert("❌ " + msg);
            return;
          }

          alert("✅ Réservation confirmée !");
          button.disabled = true;
          button.textContent = "Réservé ✅";
        } catch (error) {
          console.error("Erreur de réservation :", error);
          alert("❌ Erreur technique");
        }
      });
    });

  } catch (error) {
    console.error("Erreur globale :", error);
    container.innerHTML = `<p class="text-danger">Erreur lors du chargement des trajets.</p>`;
  }
}
