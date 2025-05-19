// js/auth/signin.js
import { setToken, setRole, clearAuthCookies } from "./auth.js";

export function initSigninPage() {
    const mailInput = document.getElementById("EmailInput");
    const passwordInput = document.getElementById("PasswordInput");
    const btnSignin = document.getElementById("btnSignin");
    const messageDiv = document.getElementById("signin-message");

    if (!mailInput || !passwordInput || !btnSignin || !messageDiv) {
        console.error("❌ Éléments du formulaire manquants");
        return;
    }

    const showMessage = (text, type = "danger") => {
        messageDiv.className = `alert alert-${type} text-center`;
        messageDiv.textContent = text;
        messageDiv.classList.remove("d-none");
    };

    btnSignin.addEventListener("click", async () => {
        const email = mailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            showMessage("Veuillez remplir tous les champs.");
            return;
        }

        try {
            const res = await fetch("http://127.0.0.1:8000/api/signin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, motdepasse: password })
            });

            if (!res.ok) {
                const errorText = await res.text();
                showMessage("Connexion échouée : " + errorText);
                mailInput.classList.add("is-invalid");
                passwordInput.classList.add("is-invalid");
                return;
            }

            const result = await res.json();
            if (!result.token) {
                showMessage("Erreur : aucun token reçu");
                return;
            }

            setToken(result.token);

            const meRes = await fetch("http://127.0.0.1:8000/api/me", {
                headers: {
                    Authorization: `Bearer ${result.token}`,
                    Accept: "application/json"
                }
            });

            if (meRes.status === 401) {
                clearAuthCookies();
                showMessage("Session expirée. Veuillez vous reconnecter.");
                return;
            }

            const user = await meRes.json();
            if (!user || user.error) {
                showMessage("Impossible de récupérer vos informations.");
                return;
            }

            const roles = user.roles || [];
            let mainRole = "utilisateur";
            if (roles.includes("ROLE_ADMIN")) mainRole = "admin";
            else if (roles.includes("ROLE_EMPLOYE")) mainRole = "employe";
            else if (roles.includes("ROLE_PASSAGER") && roles.includes("ROLE_CHAUFFEUR")) mainRole = "passager_chauffeur";
            else if (roles.includes("ROLE_CHAUFFEUR")) mainRole = "chauffeur";
            else if (roles.includes("ROLE_PASSAGER")) mainRole = "passager";

            setRole(mainRole);
            showMessage("Connexion réussie ! Redirection...", "success");

            setTimeout(() => {
                window.location.replace("/");
            }, 1500);

        } catch (err) {
            console.error("Erreur JS:", err);
            showMessage("Erreur de connexion ou serveur injoignable.");
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("signin-form")) {
        initSigninPage();
    }

});



