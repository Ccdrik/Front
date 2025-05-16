btnCreateTrajet.addEventListener("click", async () => {
    const trajet = {
        depart: departInput.value,
        destination: destinationInput.value,
        date: dateInput.value,
        heure: heureInput.value,
        places: parseInt(placesInput.value),
    };

    const token = getToken();
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
        alert("Erreur à la création du trajet");
    }
});
