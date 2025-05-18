
const departInput = document.getElementById("depart");
const destinationInput = document.getElementById("destination");
const dateInput = document.getElementById("date");
const heureInput = document.getElementById("heure");
const placesInput = document.getElementById("places");
const ecologiqueInput = document.getElementById("ecologique");
const btnCreateTrajet = document.getElementById("btn-create-trajet");

btnCreateTrajet.addEventListener("click", async () => {
    // Construire dateDepart en ISO (ex: "2025-06-01T10:00:00")
    const dateDepart = `${dateInput.value}T${heureInput.value}:00`;

    const trajet = {
        villeDepart: departInput.value,
        villeArrivee: destinationInput.value,
        dateDepart: dateDepart,
        nbPlaces: parseInt(placesInput.value),
        ecologique: ecologiqueInput.checked,
        chauffeur: `/api/users/${userId}`,
    };

    const token = getToken();
    console.log("Token:", token);
    const response = await fetch("http://localhost:8000/api/trajets", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(trajet),
    });

    if (response.ok) {
        alert("Trajet créé !");
        window.location.replace("/mes-trajets.html");
    } else {
        const errorData = await response.json();
        alert(`Erreur à la création du trajet : ${response.status} - ${errorData.message || 'Erreur inconnue'}`);
    }
});

