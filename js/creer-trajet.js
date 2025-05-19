if (document.getElementById("btn-create-trajet")) {
    const departInput = document.getElementById("depart");
    const destinationInput = document.getElementById("destination");
    const dateInput = document.getElementById("date");
    const heureInput = document.getElementById("heure");
    const placesInput = document.getElementById("places");
    const ecologiqueInput = document.getElementById("ecologique");
    const btnCreateTrajet = document.getElementById("btn-create-trajet");

    btnCreateTrajet.addEventListener("click", async () => {
        const userId = localStorage.getItem("userId");

        if (!departInput.value || !destinationInput.value || !dateInput.value || !heureInput.value || !placesInput.value) {
            alert("Merci de remplir tous les champs.");
            return;
        }

        const dateDepart = `${dateInput.value}T${heureInput.value}:00`;

        const trajet = {
            depart: departInput.value,
            arrivee: destinationInput.value,
            date_depart: dateDepart,
            nb_places: parseInt(placesInput.value),
            ecologique: ecologiqueInput.checked,
            chauffeur: `/api/users/${userId}`,
        };

        const token = getToken();
        if (!token) {
            alert("Vous devez être connecté pour créer un trajet.");
            return;
        }


        try {
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
        } catch (error) {
            console.error("Erreur fetch:", error);
            alert("Une erreur est survenue. Vérifie ta connexion.");
        }
    });

}