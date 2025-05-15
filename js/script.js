// js/script.js
import {
    isConnected,
    getRole,
    showAndHideElementsForRoles,
    tokenCookieName,
    RoleCookiename
} from './auth/auth.js';

const signoutBtn = document.getElementById('signout-btn');

function signout() {
    document.cookie = `${tokenCookieName}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
    document.cookie = `${RoleCookiename}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
    window.location.reload();
}

if (signoutBtn) {
    signoutBtn.addEventListener('click', signout);
}

document.addEventListener('DOMContentLoaded', showAndHideElementsForRoles);

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
    });
