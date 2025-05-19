document.getElementById('form-recherche').addEventListener('submit', function (event) {
    event.preventDefault(); // empêche le rechargement de page

    const depart = document.getElementById('depart').value.trim();
    const arrivee = document.getElementById('arrivee').value.trim();
    const date = document.getElementById('date').value;

    if (!depart || !arrivee || !date) {
        alert('Veuillez remplir tous les champs.');
        return;
    }

    // Exemple d'URL API, à adapter selon ton backend
    const url = `/api/trajets?depart=${encodeURIComponent(depart)}&arrivee=${encodeURIComponent(arrivee)}&date=${encodeURIComponent(date)}`;

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('Erreur API');
            return response.json();
        })
        .then(data => {
            afficherResultats(data);
        })
        .catch(err => {
            console.error(err);
            document.getElementById('resultats-trajets').innerHTML = '<p class="text-danger">Erreur lors de la recherche.</p>';
        });
});

function afficherResultats(trajets) {
    const container = document.getElementById('resultats-trajets');
    if (trajets.length === 0) {
        container.innerHTML = '<p>Aucun trajet disponible pour ces critères.</p>';
        return;
    }

    let html = '<h3>Résultats disponibles</h3><div class="list-group">';
    trajets.forEach(trajet => {
        html += `
      <div class="list-group-item">
        <h5>${trajet.depart} → ${trajet.arrivee} - ${trajet.date}</h5>
        <p>Places restantes : ${trajet.placesRestantes}</p>
        <p>Prix : ${trajet.prix} €</p>
        <p>Durée estimée : ${trajet.duree}</p>
        <p>Note : ${trajet.note}</p>
        <button class="btn btn-success btn-sm">Réserver</button>
      </div>
    `;
    });
    html += '</div>';

    container.innerHTML = html;
}
