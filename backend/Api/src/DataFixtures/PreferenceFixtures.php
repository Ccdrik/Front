<?php

namespace App\DataFixtures;

use App\Entity\Preference;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class PreferenceFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $user1 = $this->getReference('user1');

        $preference = new Preference();
        $preference->setUser($user1)
                   ->setCle('notification_email')
                   ->setValeur('oui');
        $manager->persist($preference);

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            UserFixtures::class,
        ];
    }
}
