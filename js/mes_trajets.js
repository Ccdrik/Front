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
            <td>${trajet.destination}</td>
            <td>${trajet.date}</td>
            <td>${trajet.heure}</td>
            <td>${trajet.places}</td>
            <td>${trajet.prix ?? '-'} €</td>
            <td><button class="btn btn-danger btn-sm" onclick="supprimerTrajet(${trajet.id})">Supprimer</button></td>
        `;
        tableau.appendChild(ligne);
    });
}

function supprimerTrajet(id) {
    const token = getToken();
    fetch(`http://localhost:8000/api/trajets/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => {
            if (!response.ok) throw new Error("Erreur lors de la suppression");
            alert("Trajet supprimé !");
            window.location.reload();
        })
        .catch(err => alert("Erreur API : " + err));
}

document.addEventListener("DOMContentLoaded", function () {
    const token = getToken();
    fetch("http://localhost:8000/api/trajets", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => {
            if (!response.ok) throw new Error("Erreur lors de la récupération des trajets");
            return response.json();
        })
        .then(data => afficherMesTrajets(data))
        .catch(error => console.error("Erreur lors du chargement des trajets :", error));
});
