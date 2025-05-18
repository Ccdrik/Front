<?php

namespace App\DataFixtures;

use App\Entity\Avis;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AvisFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $user1 = $this->getReference('user1');
        $user2 = $this->getReference('user2');
        $trajet1 = $this->getReference('trajet1');

        $avis = new Avis();
        $avis->setAuteur($user1)
             ->setDestinataire($user2)
             ->setTrajet($trajet1)
             ->setCommentaire('Super passager, ponctuel et sympa.')
             ->setNote(5)
             ->setDatePublication(new \DateTime());
        $manager->persist($avis);

        $manager->flush();
    }
    
    public function getDependencies(): array
    {
        return [
            UserFixtures::class,
            TrajetFixtures::class,
        ];
    }
}