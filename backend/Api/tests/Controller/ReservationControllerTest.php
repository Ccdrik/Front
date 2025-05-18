<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use App\Entity\Trajet;
use App\Entity\User;

class ReservationControllerTest extends WebTestCase
{
    public function testCreate()
    {
        $client = static::createClient();
        $em = $client->getContainer()->get('doctrine')->getManager();

        // Créer et persister un utilisateur de test
        $user = new User();
        $user->setEmail('test@example.com');
        $user->setPseudo('TestUser');
        $user->setPassword('dummyPassword');  // Pour le test, le mot de passe brut suffit
        $user->setCredits(20);
        $em->persist($user);
        $em->flush();

        // Simuler la connexion de l'utilisateur
        $client->loginUser($user);

        // Créer et persister un trajet pour le test
        $trajet = new Trajet();
        $trajet->setVilleDepart("Paris");
        $trajet->setVilleArrivee("Lyon");
        $trajet->setDateDepart(new \DateTime('+1 day'));
        $trajet->setNombrePlaces(3);
        $trajet->setPrix(50.0);
        $trajet->setDescription("Trajet de test");
        $em->persist($trajet);
        $em->flush();

        // Envoyer la requête POST avec un trajet_id valide
        $client->request(
            'POST',
            '/reservations/create',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'places' => 4,
                'trajet_id' => $trajet->getId()
            ])
        );

        // Le test attend un code 201 CREATED
        $this->assertResponseStatusCodeSame(201);
    }

    public function testIndex()
    {
        $client = static::createClient();
        $client->request('GET', '/reservations/');
        $this->assertResponseIsSuccessful();
    }
}
