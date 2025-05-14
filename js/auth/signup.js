import { setToken, setCookie, RoleCookiename } from "./auth.js";
export function initSignupPage() {
    const inputNom = document.getElementById("NomInput");
    const inputPreNom = document.getElementById("PrenomInput");
    const inputMail = document.getElementById("EmailInput");
    const inputPassword = document.getElementById("PasswordInput");
    const inputValidationPassword = document.getElementById("ValidatePasswordInput");
    const btnValidation = document.getElementById("btn-validation-inscription");

    if (!inputNom || !inputPreNom || !inputMail || !inputPassword || !inputValidationPassword || !btnValidation) {
        console.error("Éléments du formulaire d'inscription introuvables");
        return;
    }

    inputNom.addEventListener("keyup", validateForm);
    inputPreNom.addEventListener("keyup", validateForm);
    inputMail.addEventListener("keyup", validateForm);
    inputPassword.addEventListener("keyup", validateForm);
    inputValidationPassword.addEventListener("keyup", validateForm);

    btnValidation.addEventListener("click", InscrireUtilisateur);

    function validateForm() {
        const nomOk = validateRequired(inputNom);
        const prenomOk = validateRequired(inputPreNom);
        const mailOk = validateMail(inputMail);
        const passwordOk = ValidatePassword(inputPassword);
        const confirmpasswordOk = validateConfirmationPassword(inputPassword, inputValidationPassword);

        btnValidation.disabled = !(nomOk && prenomOk && mailOk && passwordOk && confirmpasswordOk);
    }

    function validateMail(input) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const mailUser = input.value;
        return applyValidation(input, mailUser.match(emailRegex));
    }

    function validateRequired(input) {
        return applyValidation(input, input.value !== '');
    }

    function ValidatePassword(input) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;
        return applyValidation(input, input.value.match(passwordRegex));
    }

    function validateConfirmationPassword(inputPwd, inputConfirmPwd) {
        return applyValidation(inputConfirmPwd, inputPwd.value === inputConfirmPwd.value);
    }

    function applyValidation(input, condition) {
        input.classList.toggle("is-valid", condition);
        input.classList.toggle("is-invalid", !condition);
        return condition;
    }

    function InscrireUtilisateur() {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        // Récupérer le rôle sélectionné
        let role = "";
        const selectedRole = document.querySelector('input[name="inlineRadioOptions"]:checked');
        if (!selectedRole) {
            alert("Veuillez sélectionner un rôle.");
            return;
        }

        switch (selectedRole.id) {
            case "inlineRadio1":
                role = "ROLE_PASSAGER";
                break;
            case "inlineRadio2":
                role = "ROLE_CHAUFFEUR";
                break;
            case "inlineRadio3":
                role = "ROLE_PASSAGER,ROLE_CHAUFFEUR"; // option "Les Deux"
                break;
        }

        const raw = JSON.stringify({
            "nom": inputNom.value,
            "prenom": inputPreNom.value,
            "email": inputMail.value,
            "motdepasse": inputPassword.value,
            "confirmationpassword": inputValidationPassword.value,
            "role": role
        });

        fetch("http://127.0.0.1:8001/api/signup", {
            method: "POST",
            headers: myHeaders,
            body: raw
        })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    alert("Inscription réussie !");
                    // stocker le rôle et token ici si tu l'as
                    setCookie(RoleCookiename, role.includes("CHAUFFEUR") ? "chauffeur" : "passager", 7);
                    window.location.href = "/"; // redirection vers la home ou dashboard
                } else if (result.error) {
                    alert("Erreur : " + result.error);
                }
            })
            .catch(error => console.error(error));
    }
}
