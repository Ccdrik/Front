<?php

namespace App\DataFixtures;

use App\Entity\Trajet;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class TrajetFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $user1 = $this->getReference('user1');
        $user2 = $this->getReference('user2');

        $trajet1 = new Trajet();
        $trajet1->setVilleDepart('Paris')
                ->setVilleArrivee('Lyon')
                ->setDateDepart(new \DateTimeImmutable('+7 days'))
                ->setChauffeur($user1);
        $manager->persist($trajet1);

        $trajet2 = new Trajet();
        $trajet2->setVilleDepart('Marseille')
                ->setVilleArrivee('Nice')
                ->setDateDepart(new \DateTimeImmutable('+10 days'))
                ->setChauffeur($user2);
        $manager->persist($trajet2);

        $manager->flush();

        $this->addReference('trajet1', $trajet1);
        $this->addReference('trajet2', $trajet2);
    }

    public function getDependencies(): array
    {
        return [
            UserFixtures::class,
        ];
    }
}
