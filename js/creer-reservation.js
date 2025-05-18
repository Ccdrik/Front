const trajetIdInput = document.getElementById("trajet-id");
const btnReserver = document.getElementById("btn-reserver");

btnReserver.addEventListener("click", async () => {
    const token = getToken();
    const reservation = {
        trajet: `/api/trajets/${trajetIdInput.value}`
    };

    const response = await fetch("http://localhost:8000/api/reservations", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reservation),
    });

    if (response.ok) {
        alert("Réservation effectuée !");
        window.location.replace("/mes-reservations.html");
    } else {
        alert("Erreur lors de la réservation");
    }
});
