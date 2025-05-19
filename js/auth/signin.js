// js/auth/signin.js
import { setToken, setRole, clearAuthCookies } from "./auth.js";

export function initSigninPage() {
    const mailInput = document.getElementById("EmailInput");
    const passwordInput = document.getElementById("PasswordInput");
    const btnSignin = document.getElementById("btnSignin");

    if (!mailInput || !passwordInput || !btnSignin) {
        console.error("❌ Champs du formulaire manquants");
        return;
    }

    btnSignin.addEventListener("click", async () => {
        const email = mailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            alert("Veuillez remplir tous les champs.");
            return;
        }

        try {
            console.log("🔐 Tentative de connexion avec :", email);

            const res = await fetch("http://127.0.0.1:8000/api/signin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, motdepasse: password })
            });

            if (!res.ok) {
                const errText = await res.text();
                console.warn("❌ Erreur API signin:", errText);
                alert("Connexion échouée : " + (errText || res.statusText));
                return;
            }

            const result = await res.json();

            if (!result.token) {
                alert("Erreur : aucun token reçu");
                return;
            }

            console.log("✅ Token reçu, enregistrement...");
            setToken(result.token);

            // Demande infos utilisateur
            const meRes = await fetch("http://127.0.0.1:8000/api/me", {
                headers: {
                    Authorization: `Bearer ${result.token}`,
                    Accept: "application/json"
                }
            });

            if (meRes.status === 401) {
                clearAuthCookies();
                alert("Session expirée, veuillez vous reconnecter.");
                return;
            }

            const user = await meRes.json();
            if (!user || user.error) throw new Error("Utilisateur non reconnu");

            const roles = user.roles || [];
            let mainRole = "utilisateur";

            if (roles.includes("ROLE_ADMIN")) mainRole = "admin";
            else if (roles.includes("ROLE_EMPLOYE")) mainRole = "employe";
            else if (roles.includes("ROLE_PASSAGER") && roles.includes("ROLE_CHAUFFEUR")) mainRole = "passager_chauffeur";
            else if (roles.includes("ROLE_CHAUFFEUR")) mainRole = "chauffeur";
            else if (roles.includes("ROLE_PASSAGER")) mainRole = "passager";

            setRole(mainRole);
            alert("✅ Connexion réussie !");
            window.location.replace("/");
        } catch (err) {
            console.error("Erreur JS:", err);
            alert("Erreur de connexion ou réseau.");
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("signin-form")) {
        initSigninPage();
    }
});
