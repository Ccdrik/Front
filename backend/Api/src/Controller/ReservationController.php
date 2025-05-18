<?php

namespace App\Controller;

use App\Repository\ReservationRepository;
use App\Repository\TrajetRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/reservations')]
class ReservationController extends AbstractController
{
     #[Route('/', name: 'reservation_index', methods: ['GET'])]
    public function index(Request $request, ReservationRepository $reservationRepository): JsonResponse
    {
        $passagerId = $request->query->get('passager_id');

        if ($passagerId) {
            // Filtrer les réservations par passager (user)
            $reservations = $reservationRepository->findBy(['user' => $passagerId]);
        } else {
            $reservations = $reservationRepository->findAll();
        }

        return $this->json(
            $reservations,
            200,
            [],
            [
                'circular_reference_handler' => fn($object) => method_exists($object, 'getId') ? $object->getId() : 'inconnu',
            ]
        );
    }

    #[Route('/create', name: 'reservation_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em, TrajetRepository $trajetRepository): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // Création d'une réservation
        $reservation = new \App\Entity\Reservation();
        if (isset($data['places'])) {
            $reservation->setPlaces($data['places']);
        }

        // Récupération et affectation du trajet
        if (isset($data['trajet_id'])) {
            $trajet = $trajetRepository->find($data['trajet_id']);
            if (!$trajet) {
                return $this->json(['error' => 'Trajet non trouvé'], JsonResponse::HTTP_NOT_FOUND);
            }
            $reservation->setTrajet($trajet);
        } else {
            return $this->json(['error' => 'trajet_id est requis'], JsonResponse::HTTP_BAD_REQUEST);
        }

        // IMPORTANT : Récupérer l'utilisateur connecté et l'affecter à la réservation
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['error' => 'User non authentifié'], JsonResponse::HTTP_UNAUTHORIZED);
        }
        $reservation->setUser($user);

        $em->persist($reservation);
        $em->flush();

        return $this->json(['status' => 'Réservation créée'], JsonResponse::HTTP_CREATED);
    }
}
