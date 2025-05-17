<?php

namespace App\DataFixtures;

use App\Entity\Reservation;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class ReservationFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $user2 = $this->getReference('user2');
        $trajet1 = $this->getReference('trajet1');

        $reservation1 = new Reservation();
        $reservation1->setPassager($user2)
                     ->setTrajet($trajet1)
                     ->setDateReservation(new \DateTime());
        $manager->persist($reservation1);

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