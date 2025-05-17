<?php

namespace App\DataFixtures;

use App\Entity\User;
use App\Entity\Trajet;
use App\Entity\Reservation;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use DateTime;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        // Création d'un utilisateur de test
        $user = new User();
        $user->setEmail('john.doe@example.com');
        $user->setPseudo('JohnDoe');
        $user->setPassword('pass'); // En production, pensez à hasher ce mot de passe !
        $user->setCredits(20);
        $manager->persist($user);

        // Création d'un trajet
        $trajet = new Trajet();
        $trajet->setVilleDepart("Paris");
        $trajet->setVilleArrivee("Lyon");
        $trajet->setDateDepart(new DateTime('+2 days'));
        $trajet->setChauffeur($user);
        $manager->persist($trajet);

        // Création d'une réservation
        $reservation = new Reservation();
        $reservation->setPlaces(2);
        $reservation->setUser($user);
        $reservation->setTrajet($trajet);
        $manager->persist($reservation);

        // Enregistrer en base
        $manager->flush();
    }
}
