import Route from "./Route.js";

//Définir ici vos routes
export const allRoutes = [
    new Route("/", "Accueil", "/pages/home.html", []),
    new Route("/itinéraires", "Les itinéraires", "/pages/itinéraires.html", []),
    new Route("/signin", "Connexion", "pages/auth/signin.html", ["disconnected"], "/js/auth/signin.js"),
    new Route("/signup", "Inscription", "pages/auth/signup.html", ["disconnected"], "/js/auth/signup.js"),
    new Route("/account", "Mon Compte", "pages/auth/account.html", ["passager", "chauffeur", "employe", "admin"]),
    new Route("/editPassword", "Changement de mot de passe", "pages/auth/editPassword.html", ["passager", "chauffeur", "employe", "admin"]),
    new Route("/covoiturages", "Accés covoiturages", "pages/covoiturages.html", ["passager", "chauffeur", "employe", "admin"]),
    new Route("/mentionslegales", "Mentions légales", "pages/mentionslegales.html", []),
];

//Le titre s'affiche comme ceci : Route.titre - websitename
export const websiteName = "EcoRide";