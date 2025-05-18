<?php

namespace App\DataFixtures;

use App\Entity\Voiture;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class VoitureFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $user1 = $this->getReference('user1');
        $user2 = $this->getReference('user2');

        $voiture1 = new Voiture();
        $voiture1->setMarque('Toyota')
                 ->setModele('Corolla')
                 ->setImmatriculation('AB-123-CD')
                 ->setUser($user1);
        $manager->persist($voiture1);

        $voiture2 = new Voiture();
        $voiture2->setMarque('Renault')
                 ->setModele('Clio')
                 ->setImmatriculation('EF-456-GH')
                 ->setUser($user2);
        $manager->persist($voiture2);

        $manager->flush();
    } 
    
    public function getDependencies(): array
    {
        return [
            UserFixtures::class,
        ];
    }
}

