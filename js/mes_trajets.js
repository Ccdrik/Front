// js/mes_trajets.js

function afficherMesTrajets(trajets) {
    const tableau = document.getElementById("tableau-trajets");
    if (!tableau) {
        console.error("Élément #tableau-trajets non trouvé dans le DOM.");
        return;
    }

    tableau.innerHTML = "";
    trajets.forEach(trajet => {
        const ligne = document.createElement("tr");
        ligne.innerHTML = `
            <td>${trajet.depart}</td>
            <td>${trajet.arrivee}</td>
            <td>${trajet.date}</td>
            <td>${trajet.heure}</td>
            <td>${trajet.places}</td>
            <td>${trajet.prix} €</td>
            <td><button class="btn btn-danger btn-sm" onclick="supprimerTrajet(${trajet.id})">Supprimer</button></td>
        `;
        tableau.appendChild(ligne);
    });
}

function supprimerTrajet(id) {
    alert("Suppression du trajet ID = " + id + " (fonction non encore connectée à l'API)");
}

document.addEventListener("DOMContentLoaded", function () {
    const trajetsSimules = [
        { id: 1, depart: "Paris", arrivee: "Lyon", date: "2025-06-01", heure: "09:00", places: 3, prix: 15 },
        { id: 2, depart: "Toulouse", arrivee: "Bordeaux", date: "2025-06-05", heure: "14:30", places: 2, prix: 10 }
    ];
    afficherMesTrajets(trajetsSimules);
});
