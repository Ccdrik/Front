import { setCookie, RoleCookiename } from "./auth.js";

export function initSignupPage() {
    const inputNom = document.getElementById("NomInput");
    const inputPreNom = document.getElementById("PrenomInput");
    const inputMail = document.getElementById("EmailInput");
    const inputPseudo = document.getElementById("PseudoInput");
    const inputPassword = document.getElementById("PasswordInput");
    const inputValidationPassword = document.getElementById("ValidatePasswordInput");
    const btnValidation = document.getElementById("btn-validation-inscription");

    if (!inputNom || !inputPreNom || !inputMail || !inputPassword || !inputValidationPassword || !btnValidation || !inputPseudo) {
        console.error("Éléments du formulaire introuvables");
        return;
    }

    const validateForm = async () => {
        const nomOk = inputNom.value.trim() !== '';
        const prenomOk = inputPreNom.value.trim() !== '';
        const mailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputMail.value);
        const pseudoOk = inputPseudo.value.trim() !== '';
        const passwordOk = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(inputPassword.value);
        const confirmpasswordOk = inputPassword.value === inputValidationPassword.value;

        const pseudoAvailable = pseudoOk ? await checkAvailability('pseudo', inputPseudo.value) : false;
        const emailAvailable = mailOk ? await checkAvailability('email', inputMail.value) : false;

        setValidity(inputNom, nomOk);
        setValidity(inputPreNom, prenomOk);
        setValidity(inputMail, mailOk && emailAvailable);
        setValidity(inputPseudo, pseudoOk && pseudoAvailable);
        setValidity(inputPassword, passwordOk);
        setValidity(inputValidationPassword, confirmpasswordOk);

        btnValidation.disabled = !(nomOk && prenomOk && mailOk && emailAvailable && pseudoOk && pseudoAvailable && passwordOk && confirmpasswordOk);
    };

    function setValidity(input, isValid) {
        input.classList.toggle("is-valid", isValid);
        input.classList.toggle("is-invalid", !isValid);
    }

    async function checkAvailability(type, value) {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/check-${type}?${type}=${encodeURIComponent(value)}`);
            if (!response.ok) return false;
            const data = await response.json();
            return data.available;
        } catch {
            return false;
        }
    }

    btnValidation.addEventListener("click", async () => {
        await validateForm();

        if (btnValidation.disabled) {
            alert("Veuillez corriger les erreurs avant de soumettre.");
            return;
        }

        const selectedRole = document.querySelector('input[name="inlineRadioOptions"]:checked');
        if (!selectedRole) {
            alert("Veuillez sélectionner un rôle.");
            return;
        }

        const rolesMap = {
            "inlineRadio1": ["ROLE_PASSAGER"],
            "inlineRadio2": ["ROLE_CHAUFFEUR"],
            "inlineRadio3": ["ROLE_PASSAGER", "ROLE_CHAUFFEUR"]
        };
        const roles = rolesMap[selectedRole.id] || [];

        const payload = {
            nom: inputNom.value.trim(),
            prenom: inputPreNom.value.trim(),
            pseudo: inputPseudo.value.trim(),
            email: inputMail.value.trim(),
            motdepasse: inputPassword.value,
            confirmationpassword: inputValidationPassword.value,
            roles: roles
        };

        try {
            const response = await fetch("http://127.0.0.1:8000/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                alert("Inscription réussie !");
                let roleLabel = "utilisateur";
                if (roles.includes("ROLE_PASSAGER") && roles.includes("ROLE_CHAUFFEUR")) roleLabel = "passager_chauffeur";
                else if (roles.includes("ROLE_CHAUFFEUR")) roleLabel = "chauffeur";
                else if (roles.includes("ROLE_PASSAGER")) roleLabel = "passager";

                setCookie(RoleCookiename, roleLabel, 7);
                window.location.href = "/";
            } else {
                const errorMsg = result.error || "Inscription échouée. Veuillez vérifier vos informations.";
                alert("Erreur : " + errorMsg);
            }

        } catch (e) {
            alert("Erreur serveur, merci de réessayer plus tard.");
            console.error("Erreur lors de la requête d'inscription :", e);
        }
    });

    [inputNom, inputPreNom, inputMail, inputPseudo, inputPassword, inputValidationPassword].forEach(el => {
        el.addEventListener("input", () => validateForm());
    });

    validateForm();
}

document.addEventListener("DOMContentLoaded", () => {
    initSignupPage();
});
