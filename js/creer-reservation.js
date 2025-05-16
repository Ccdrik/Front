btnCreateReservation.addEventListener("click", async () => {
    const trajetId = parseInt(trajetIdInput.value);
    const placesReservees = parseInt(placesReserveesInput.value);
    const token = getToken();

    const response = await fetch("http://localhost:8000/api/reservations", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            trajetId,
            placesReservees
        }),
    });

    if (response.ok) {
        alert("Réservation créée !");
        // Redirection ou autre action
    } else {
        const errorData = await response.json();
        alert("Erreur : " + (errorData.error || "Erreur inconnue"));
    }
});
