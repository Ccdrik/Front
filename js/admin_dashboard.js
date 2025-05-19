
import { getToken } from './auth/auth.js';

const token = getToken();

async function fetchStats() {
    // Données statiques à remplacer par API si dispo
    const trajetsData = {
        labels: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'],
        data: [5, 7, 3, 8, 6]
    };

    const creditsData = {
        labels: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'],
        data: [20, 35, 18, 42, 26]
    };

    new Chart(document.getElementById('trajetsChart'), {
        type: 'bar',
        data: {
            labels: trajetsData.labels,
            datasets: [{
                label: 'Nombre de trajets',
                data: trajetsData.data,
                backgroundColor: 'rgba(75, 192, 192, 0.6)'
            }]
        }
    });

    new Chart(document.getElementById('creditsChart'), {
        type: 'line',
        data: {
            labels: creditsData.labels,
            datasets: [{
                label: 'Crédits gagnés',
                data: creditsData.data,
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
                fill: true
            }]
        }
    });
}

async function loadUsers() {
    const res = await fetch('http://127.0.0.1:8000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
    });
    const users = await res.json();
    const tbody = document.getElementById('userTableBody');

    if (!Array.isArray(users)) {
        console.error("Erreur API :", users);
        alert(users.error || "Erreur API");
        return;
    }

    users.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${user.id}</td>
            <td>${user.pseudo}</td>
            <td>${user.email}</td>
            <td>${user.credits}</td>
            <td>${user.actif === false ? 'Suspendu' : 'Actif'}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="suspendUser(${user.id})">Suspendre</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

window.suspendUser = async (id) => {
    if (!confirm("Suspendre cet utilisateur ?")) return;

    const res = await fetch(`http://127.0.0.1:8000/api/users/${id}/suspend`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
    });

    if (res.ok) {
        alert("Utilisateur suspendu.");
        location.reload();
    } else {
        alert("Erreur lors de la suspension.");
    }
};

document.addEventListener('DOMContentLoaded', () => {
    fetchStats();
    loadUsers();
});


