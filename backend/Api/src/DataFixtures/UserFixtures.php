<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use App\Entity\User;



class UserFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
      $user1 = new User();
        $user1->setNom('Dupont')
              ->setPrenom('Jean')
              ->setEmail('jean.dupont@example.com')
              ->setPassword(password_hash('pass123', PASSWORD_BCRYPT));
        $manager->persist($user1);

        $user2 = new User();
        $user2->setNom('Martin')
              ->setPrenom('Claire')
              ->setEmail('claire.martin@example.com')
              ->setPassword(password_hash('pass456', PASSWORD_BCRYPT));
        $manager->persist($user2);

        $manager->flush();

        // On peut sauvegarder les références pour les utiliser dans d'autres fixtures
        $this->addReference('user1', $user1);
        $this->addReference('user2', $user2);
}

public function getRoles(): array
{
    $roles = $this->roles;
    $roles[] = 'ROLE_USER';
    return array_unique($roles);
}
}