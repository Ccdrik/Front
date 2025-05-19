
window.addEventListener("DOMContentLoaded", async () => {
    const response = await fetch("http://localhost:8000/api/trajets");
    const trajets = await response.json();

    const container = document.getElementById("liste-trajets");

    trajets["hydra:member"].forEach(t => {
        container.innerHTML += `
      <div class="card p-3 m-2">
        <h5>${t.depart} → ${t.arrivee}</h5>
        <p>Date : ${t.date_depart} à ${t.heure_depart}</p>
        <p>Conducteur : ${t.conducteur.pseudo}</p>
        <p>Prix : ${t.prix} crédits</p>
        <button onclick="voirDetail(${t.id})" class="btn btn-primary">Voir</button>
      </div>
    `;
    });
});

function voirDetail(id) {
    localStorage.setItem("selectedTrajetId", id);
    window.location.href = "reservation.html";
}
