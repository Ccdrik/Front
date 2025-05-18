// === AUTOCOMPLÉTION DES ADRESSES ===
document.addEventListener('DOMContentLoaded', () => {
    const autocompleteFields = ['depart', 'arrivee'];

    autocompleteFields.forEach(fieldId => {
        const input = document.getElementById(fieldId);
        if (!input) return;

        input.addEventListener('input', async () => {
            const query = input.value.trim();
            if (query.length < 3) return;

            try {
                const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=5`);
                const data = await response.json();

                const datalistId = `${fieldId}-suggestions`;
                let datalist = document.getElementById(datalistId);
                if (!datalist) {
                    datalist = document.createElement('datalist');
                    datalist.id = datalistId;
                    document.body.appendChild(datalist);
                    input.setAttribute('list', datalistId);
                }

                datalist.innerHTML = '';
                data.features.forEach(feature => {
                    const option = document.createElement('option');
                    option.value = feature.properties.label;
                    datalist.appendChild(option);
                });
            } catch (error) {
                console.error("Erreur d'autocomplétion :", error);
            }
        });
    });

    // === GESTION DU FORMULAIRE (CALCUL DISTANCE + DURÉE) ===
    const form = document.querySelector('form');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const depart = document.getElementById('depart')?.value;
        const arrivee = document.getElementById('arrivee')?.value;

        if (!depart || !arrivee) {
            alert("Veuillez remplir les deux adresses.");
            return;
        }

        const coordDepart = await getCoordinates(depart);
        const coordArrivee = await getCoordinates(arrivee);

        if (coordDepart && coordArrivee) {
            const distance = haversineDistance(coordDepart, coordArrivee);
            const speed = 60; // km/h fictive
            const duration = distance / speed;

            const hours = Math.floor(duration);
            const minutes = Math.round((duration - hours) * 60);

            alert(`Distance estimée : ${distance.toFixed(1)} km\nDurée approximative : ${hours}h ${minutes}min`);

            // Décommenter pour envoyer le formulaire après calcul :
            // form.submit();
        } else {
            alert("Erreur lors du calcul : adresse(s) non reconnue(s).");
        }
    });
});

// === FONCTIONS UTILES ===

async function getCoordinates(address) {
    try {
        const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(address)}&limit=1`);
        const data = await response.json();
        if (data.features.length > 0) {
            return data.features[0].geometry.coordinates; // [lon, lat]
        }
    } catch (error) {
        console.error("Erreur de géocodage :", error);
    }
    return null;
}

function haversineDistance(coord1, coord2) {
    const R = 6371; // Rayon Terre en km
    const toRad = deg => deg * Math.PI / 180;

    const [lon1, lat1] = coord1;
    const [lon2, lat2] = coord2;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}
