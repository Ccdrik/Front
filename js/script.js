import {
    isConnected,
    getRole,
    showAndHideElementsForRoles,
    tokenCookieName,
    roleCookieName // Corrigé ici si besoin
} from './auth/auth.js';

document.addEventListener('DOMContentLoaded', () => {
    showAndHideElementsForRoles();

    const signoutBtn = document.getElementById('signout-btn');
    if (signoutBtn) {
        signoutBtn.addEventListener('click', () => {
            document.cookie = `${tokenCookieName}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
            document.cookie = `${roleCookieName}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
            window.location.reload();
        });
    }

    fetch('http://127.0.0.1:8000/api/covoiturages', {
        credentials: 'include'
    })
        .then(response => {
            if (!response.ok) throw new Error('Erreur de la requête');
            return response.json();
        })
        .then(data => {
            console.log('Trajets reçus:', data);
            const container = document.getElementById('trajets');
            if (!container) return;

            data.forEach(trajet => {
                const li = document.createElement('li');
                li.textContent = `Départ : ${trajet.depart} → Arrivée : ${trajet.arrivee}`;
                container.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Erreur lors du fetch des trajets:', error);
            const container = document.getElementById('trajets');
            if (container) {
                container.innerHTML = `<li class="text-danger">Impossible de charger les trajets.</li>`;
            }
        });
});
