export function initSigninPage() {
    const mailInput = document.getElementById("EmailInput");
    const passwordInput = document.getElementById("PasswordInput");
    const btnSignin = document.getElementById("btnSignin");

    if (!mailInput || !passwordInput || !btnSignin) {
        console.error("Éléments du formulaire de connexion introuvables");
        return;
    }

    btnSignin.addEventListener("click", () => {
        if (mailInput.value === "test@mail.fr" && passwordInput.value === "123") {
            const token = "lkjsdngfljsqdnglkjsdbglkjqskjgkfjgbqslkfdgbskldfgdfgsdgf";
            setToken(token);
            setCookie(RoleCookiename, "admin", 7);
            window.location.replace("/");
        } else {
            mailInput.classList.add("is-invalid");
            passwordInput.classList.add("is-invalid");
        }
    });
}