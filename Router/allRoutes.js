import Route from "./Route.js";

//Définir ici vos routes
export const allRoutes = [
    new Route("/", "Accueil", "/pages/home.html"),
    new Route("/itinéraires", "Les itinéraires", "/pages/itinéraires.html"),
    new Route("/signin", "Connexion", "pages/auth/signin.html"),
    new Route("/signup", "Inscription", "pages/auth/signup.html", "/js/auth/signup.js"),
    new Route("/account", "Mon Compte", "pages/auth/account.html"),
    new Route("/editPassword", "Changement de mot de passe", "pages/auth/editPassword.html"),
    new Route("/allResa", "Vos Reservations", "pages/reservations/allResa.html"),
    new Route("/reserver", "Réservez", "pages/reservations/reserver.html"),
];

//Le titre s'affiche comme ceci : Route.titre - websitename
export const websiteName = "EcoRide";