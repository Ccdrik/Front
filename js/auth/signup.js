// js/auth/signup.js
import { setToken, setRole } from "./auth.js";

export function initSignupPage() {
    const inputNom = document.getElementById("NomInput");
    const inputPrenom = document.getElementById("PrenomInput");
    const inputMail = document.getElementById("EmailInput");
    const inputPseudo = document.getElementById("PseudoInput");
    const inputPassword = document.getElementById("PasswordInput");
    const inputValidationPassword = document.getElementById("ValidatePasswordInput");
    const selectRole = document.getElementById("RoleSelect");
    const btnValidation = document.getElementById("btn-validation-inscription");
    const messageDiv = document.getElementById("signup-message");

    if (!inputNom || !inputPrenom || !inputMail || !inputPassword || !inputValidationPassword || !btnValidation || !inputPseudo || !selectRole || !messageDiv) {
        console.error("❌ Éléments du formulaire manquants");
        return;
    }

    const showMessage = (text, type = "danger") => {
        messageDiv.className = `alert alert-${type} text-center`;
        messageDiv.textContent = text;
        messageDiv.classList.remove("d-none");
    };

    async function validateForm() {
        const nomOk = inputNom.value.trim() !== '';
        const prenomOk = inputPrenom.value.trim() !== '';
        const mailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputMail.value);
        const pseudoOk = inputPseudo.value.trim() !== '';
        const passwordOk = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(inputPassword.value);
        const confirmOk = inputPassword.value === inputValidationPassword.value;
        const roleSelected = selectRole.value !== '';

        const pseudoAvailable = pseudoOk ? await checkAvailability('pseudo', inputPseudo.value) : false;
        const emailAvailable = mailOk ? await checkAvailability('email', inputMail.value) : false;

        setValidity(inputNom, nomOk);
        setValidity(inputPrenom, prenomOk);
        setValidity(inputMail, mailOk && emailAvailable);
        setValidity(inputPseudo, pseudoOk && pseudoAvailable);
        setValidity(inputPassword, passwordOk);
        setValidity(inputValidationPassword, confirmOk);
        setValidity(selectRole, roleSelected);

        btnValidation.disabled = !(nomOk && prenomOk && mailOk && emailAvailable && pseudoOk && pseudoAvailable && passwordOk && confirmOk && roleSelected);
    }

    function setValidity(input, isValid) {
        input.classList.toggle("is-valid", isValid);
        input.classList.toggle("is-invalid", !isValid);
    }

    async function checkAvailability(type, value) {
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/check-${type}?${type}=${encodeURIComponent(value)}`);
            const data = await res.json();
            return data.available;
        } catch {
            return false;
        }
    }

    btnValidation.addEventListener("click", async () => {
        await validateForm();

        if (btnValidation.disabled) {
            showMessage("Veuillez corriger les erreurs avant de soumettre.");
            return;
        }

        const selectedRoleValue = selectRole.value;
        let roles = [];
        if (selectedRoleValue === "passager") roles = ["ROLE_PASSAGER"];
        else if (selectedRoleValue === "chauffeur") roles = ["ROLE_CHAUFFEUR"];
        else if (selectedRoleValue === "passager,chauffeur") roles = ["ROLE_PASSAGER", "ROLE_CHAUFFEUR"];
        else return showMessage("Veuillez sélectionner un rôle valide.");

        const payload = {
            nom: inputNom.value.trim(),
            prenom: inputPrenom.value.trim(),
            pseudo: inputPseudo.value.trim(),
            email: inputMail.value.trim(),
            motdepasse: inputPassword.value,
            confirmationpassword: inputValidationPassword.value,
            roles: roles
        };

        try {
            const res = await fetch("http://127.0.0.1:8000/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const result = await res.json();

            if (res.ok && result.token && result.success) {
                setToken(result.token);
                let roleLabel = "utilisateur";
                if (roles.includes("ROLE_PASSAGER") && roles.includes("ROLE_CHAUFFEUR")) roleLabel = "chauffeur";
                else if (roles.includes("ROLE_CHAUFFEUR")) roleLabel = "chauffeur";
                else if (roles.includes("ROLE_PASSAGER")) roleLabel = "passager";

                setRole(roleLabel);
                showMessage("Inscription réussie ! Redirection...", "success");

                setTimeout(() => {
                    window.location.href = "/";
                }, 1500);
            } else {
                showMessage(result.error || "Erreur lors de l'inscription");
            }
        } catch (e) {
            console.error("Erreur inscription :", e);
            showMessage("Erreur serveur, merci de réessayer plus tard.");
        }
    });

    [inputNom, inputPrenom, inputMail, inputPseudo, inputPassword, inputValidationPassword, selectRole].forEach(el => {
        el.addEventListener("input", () => validateForm());
    });

    validateForm();
}

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("signup-form")) {
        initSignupPage();
    }
});
