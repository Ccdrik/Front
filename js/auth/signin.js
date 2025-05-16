import { setToken, setCookie, RoleCookiename } from "./auth.js";

export function initSigninPage() {
    const mailInput = document.getElementById("EmailInput");
    const passwordInput = document.getElementById("PasswordInput");
    const btnSignin = document.getElementById("btnSignin");

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
                if (result.token) {
                    const token = result.token;
                    setToken(token);

                    // On récupère les infos utilisateur avec le token
                    fetch("http://127.0.0.1:8000/api/me", {
                        method: "GET",
                        headers: {
                            "Authorization": "Bearer " + token,
                            "Accept": "application/json"
                        }
                    })
                        .then(res => res.json())
                        .then(user => {
                            if (!user || user.error) {
                                alert("Impossible de récupérer les infos utilisateur");
                                return;
                            }

                            const roles = user.roles || [];

                            // Détection de rôle prioritaire
                            let mainRole = "utilisateur";
                            if (roles.includes("ROLE_ADMIN")) mainRole = "admin";
                            else if (roles.includes("ROLE_EMPLOYE")) mainRole = "employe";
                            else if (roles.includes("ROLE_PASSAGER") && roles.includes("ROLE_CHAUFFEUR")) mainRole = "passager_chauffeur";
                            else if (roles.includes("ROLE_CHAUFFEUR")) mainRole = "chauffeur";
                            else if (roles.includes("ROLE_PASSAGER")) mainRole = "passager";

                            setCookie(RoleCookiename, mainRole, 7);

                            // Redirection après connexion
                            window.location.replace("/");
                        })
                        .catch(err => {
                            console.error("Erreur récupération utilisateur:", err);
                            alert("Erreur lors de la récupération des données utilisateur.");
                        });
                } else {
                    mailInput.classList.add("is-invalid");
                    passwordInput.classList.add("is-invalid");
                    alert("Erreur : " + (result.error || "Connexion échouée"));
                }
            })
            .catch(error => {
                console.error("Erreur serveur :", error);
                alert("Erreur réseau. Veuillez réessayer.");
            });
    });
}
