import { setToken, setRole } from "./auth.js";

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

        fetch("http://127.0.0.1:8000/api/signin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, motdepasse: password })
        })
            .then(res => res.json())
            .then(result => {
                if (!result.token) {
                    alert("Erreur : " + (result.error || "Connexion échouée"));
                    mailInput.classList.add("is-invalid");
                    passwordInput.classList.add("is-invalid");
                    return;
                }

                setToken(result.token);

                return fetch("http://127.0.0.1:8000/api/me", {
                    headers: {
                        "Authorization": "Bearer " + result.token,
                        "Accept": "application/json"
                    }
                });
            })
            .then(res => res?.json())
            .then(user => {
                if (!user || user.error) throw new Error("Infos utilisateur indisponibles");

                const roles = user.roles || [];

                let mainRole = "utilisateur";
                if (roles.includes("ROLE_ADMIN")) mainRole = "admin";
                else if (roles.includes("ROLE_EMPLOYE")) mainRole = "employe";
                else if (roles.includes("ROLE_PASSAGER") && roles.includes("ROLE_CHAUFFEUR")) mainRole = "passager_chauffeur";
                else if (roles.includes("ROLE_CHAUFFEUR")) mainRole = "chauffeur";
                else if (roles.includes("ROLE_PASSAGER")) mainRole = "passager";

                setRole(mainRole);
                window.location.replace("/");
            })
            .catch(err => {
                console.error("Erreur:", err);
                alert("Erreur lors de la connexion ou récupération utilisateur.");
            });
    });
}
