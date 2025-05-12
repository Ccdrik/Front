const btnSignoutList = document.querySelectorAll(".signout-btn");

btnSignoutList.forEach(btn => {
    btn.addEventListener("click", logoutUser);
});

function logoutUser() {
    // Supprimer le token stocké
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");

    // Supprimer les cookies
    document.cookie = "RoleCookiename=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Redirection vers la page de connexion
    window.location.replace("/login");
}