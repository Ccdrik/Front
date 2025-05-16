<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class CovoiturageControllerTest extends WebTestCase
{
    public function testIndex()
    {
        $client = static::createClient();
        $client->request('GET', '/covoiturages/');

        // Vérifie que la réponse est un succès HTTP (200)
        $this->assertResponseIsSuccessful();
    }
}
