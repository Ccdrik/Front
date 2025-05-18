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
    new Route("/contact", "Contact", "pages/contact.html", []),
    new Route("/details", "Details", "pages/details.html", [],),
    new Route("/mentionslegales", "Mentions légales", "pages/mentionslegales.html", []),
    new Route("/creertrajet", "Creation d'un trajet", "pages/creertrajet.html", ["chauffeur"], "/js/creer-trajet.js"),
    new Route("/edittrajet", "Modification de mon trajet", "pages/edittrajet.html", ["chauffeur"]),
    new Route("/ajouter-vehicule", "Ajouter un véhicule", "pages/ajouter-vehicule.html", ["chauffeur"]),
    new Route("/mestrajets", "Mes trajets", "pages//mestrajets.html", ["chauffeur", "passager"], "/js/mes-trajets.js"),
    new Route("/mesreservations", "Mes réservations", "pages/mesreservations.html", ["passager"], "/js/creer-reservations.js"),
    new Route("/administrateur", "Espace Administrateur", "pages//administrateur.html", ["admin"]),
    new Route("/employe", "Espace Employés", "pages//employe.html", ["employe"]),
    new Route("/reservations", "Reservations", "pages/reservations.html", []),
];

//Le titre s'affiche comme ceci : Route.titre - websitename
export const websiteName = "EcoRide";