if (document.getElementById("btn-reserver")) {

    const trajetIdInput = document.getElementById("trajet-id");
    const btnReserver = document.getElementById("btn-reserver");

    btnReserver.addEventListener("click", async () => {
        const token = getToken();
        const passagerId = localStorage.getItem("userId");

        if (!trajetIdInput.value) {
            alert("ID du trajet manquant.");
            return;
        }

        const reservation = {
            trajet: `/api/trajets/${trajetIdInput.value}`,
            passager: `/api/users/${passagerId}`
        };

        try {
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
                const errorData = await response.json();
                alert(`Erreur (${response.status}) : ${errorData.message || 'Réservation impossible'}`);
            }
        } catch (error) {
            console.error("Erreur fetch:", error);
            alert("Une erreur s'est produite lors de la réservation.");
        }
    });

}