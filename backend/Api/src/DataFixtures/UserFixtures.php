<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use App\Entity\User;



class UserFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        // Création d'un utilisateur fictif
        $user = new User();
        $user->setPseudo("CedricDu63");
        $user->setEmail("cedric@example.com");
        $user->setPassword(password_hash("monpassword", PASSWORD_BCRYPT));
        $user->setCredits(20);



        // Enregistrement de l'utilisateur en base
        $manager->persist($user);

        // Exécute l'insertion dans la base
        $manager->flush();
    }
}
