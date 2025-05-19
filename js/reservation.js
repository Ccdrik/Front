// js/reservation.js
import { getToken } from './auth/auth.js';

document.addEventListener("DOMContentLoaded", () => {
    const bouton = document.getElementById("btn-reserver");
    const urlParams = new URLSearchParams(window.location.search);
    const trajetId = urlParams.get("id");

    if (!bouton || !trajetId) return;

    bouton.addEventListener("click", async () => {
        const token = getToken();
        if (!token) {
            alert("Vous devez être connecté pour réserver.");
            window.location.href = "/pages/signin.html";
            return;
        }

        // Double confirmation
        const confirmation = confirm("Souhaitez-vous utiliser vos crédits pour réserver ce trajet ?");
        if (!confirmation) return;

        try {
            const response = await fetch("http://127.0.0.1:8000/api/reservations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    trajet: `/api/trajets/${trajetId}`
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Erreur de l'API :", errorData);
                alert(errorData.message || "Erreur lors de la réservation.");
                return;
            }

            alert("✅ Réservation confirmée !");
            window.location.href = "/pages/mes_reservations.html";

        } catch (error) {
            console.error("Erreur :", error);
            alert("Erreur lors de la réservation.");
        }
    });
});
