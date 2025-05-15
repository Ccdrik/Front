import { setToken, setCookie, RoleCookiename } from "./auth.js";

export function initSigninPage() {
    const mailInput = document.getElementById("EmailInput");
    const passwordInput = document.getElementById("PasswordInput");
    const btnSignin = document.getElementById("btnSignin");
    const signinForm = document.getElementById("formulaire-connexion");

    if (!mailInput || !passwordInput || !btnSignin) {
        console.error("Éléments du formulaire de connexion introuvables");
        return;
    }

    btnSignin.addEventListener("click", () => {
        const email = mailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            alert("Veuillez remplir tous les champs");
            return;
        }

        const payload = {
            email: email,
            motdepasse: password
        };

        fetch("http://127.0.0.1:8000/api/signin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    const token = result.token;
                    const roles = result.user.roles;

                    setToken(token);

                    // ✅ Détection de rôle prioritaire
                    let mainRole = "utilisateur";
                    if (roles.includes("ROLE_ADMIN")) mainRole = "admin";
                    else if (roles.includes("ROLE_EMPLOYE")) mainRole = "employe";
                    else if (roles.includes("ROLE_CHAUFFEUR")) mainRole = "chauffeur";
                    else if (roles.includes("ROLE_PASSAGER")) mainRole = "passager";

                    setCookie(RoleCookiename, mainRole, 7);

                    window.location.replace("/"); // redirection selon rôle possible ici
                } else {
                    mailInput.classList.add("is-invalid");
                    passwordInput.classList.add("is-invalid");
                    alert("Erreur : " + result.error);
                }
            })
            .catch(error => {
                console.error("Erreur serveur :", error);
                alert("Erreur réseau. Veuillez réessayer.");
            });
    });
}
