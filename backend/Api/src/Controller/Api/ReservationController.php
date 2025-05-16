<?php

namespace App\Controller\Api;

use App\Entity\Reservation;
use App\Entity\Trajet;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class ReservationController extends AbstractController
{
    #[Route('/api/reservations', name: 'api_create_reservation', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['passager_id'], $data['trajet_id'], $data['nb_places'])) {
            return $this->json(['error' => 'Données manquantes'], 400);
        }

        $passager = $em->getRepository(User::class)->find($data['passager_id']);
        $trajet = $em->getRepository(Trajet::class)->find($data['trajet_id']);

        if (!$passager || !$trajet) {
            return $this->json(['error' => 'Passager ou trajet introuvable'], 404);
        }

        if ($trajet->getPlaces() < $data['nb_places']) {
            return $this->json(['error' => 'Pas assez de places disponibles'], 400);
        }

        $reservation = new Reservation();
        $reservation->setPassager($passager);
        $reservation->setTrajet($trajet);
        $reservation->setNbPlaces($data['nb_places']);

        // Mettre à jour le nombre de places disponibles
        $trajet->setPlaces($trajet->getPlaces() - $data['nb_places']);

        $em->persist($reservation);
        $em->flush();

        return $this->json(['message' => 'Réservation effectuée avec succès'], 201);
    }
}
