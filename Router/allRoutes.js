// js/allRoutes.js — liste des routes de l'application EcoRide
import Route from "../Router/Route.js";

export const allRoutes = [
    new Route("/", "Accueil", "pages/home.html", [], "/js/script.js"),
    new Route("/itinéraires", "Les itinéraires", "/pages/itinéraires.html", []),
    new Route("/signin", "Connexion", "/pages/auth/signin.html", ["disconnected"], "/js/auth/signin.js"),
    new Route("/signup", "Inscription", "/pages/auth/signup.html", ["disconnected"], "/js/auth/signup.js"),
    new Route("/account", "Mon Compte", "/pages/auth/account.html", ["passager", "chauffeur", "employe", "admin"]),
    new Route("/editPassword", "Changement de mot de passe", "/pages/auth/editPassword.html", ["passager", "chauffeur", "employe", "admin"]),
    new Route("/covoiturages", "Accès covoiturages", "/pages/covoiturages.html", ["passager", "chauffeur", "employe", "admin"], "/js/trajets_liste.js"),

    new Route("/contact", "Contact", "/pages/contact.html", []),
    new Route("/details", "Détails", "/pages/details.html", [], "/js/trajet_details.js"),
    new Route("/mentionslegales", "Mentions légales", "/pages/mentionslegales.html", []),
    new Route("/creertrajet", "Création d'un trajet", "/pages/creertrajet.html", ["chauffeur"], "/js/creer-trajet.js"),
    new Route("/edittrajet", "Modification de mon trajet", "/pages/edittrajet.html", ["chauffeur"]),
    new Route("/vehicule", "Ajouter un véhicule", "/pages/vehicule.html", ["chauffeur"]),
    new Route("/mestrajets", "Mes trajets", "/pages/mestrajets.html", ["chauffeur", "passager"], "/js/mes_trajets.js"),
    new Route("/mesreservations", "Mes réservations", "/pages/mesreservations.html", ["passager"], "/js/mes-reservations.js"),
    new Route("/dashboard", "Dashboard Admin", "/pages/admin_dashboard.html", ["admin"], "/js/admin_dashboard.js"),
    new Route("/employe", "Espace Employés", "/pages/employe.html", ["employe"]),
    new Route("/reservations", "Réservations", "/pages/reservations.html", ["employe", "passager"], "/js/reservation.js")
];

export const websiteName = "EcoRide";
