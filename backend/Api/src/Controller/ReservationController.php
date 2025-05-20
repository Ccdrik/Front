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
public function create(Request $request, EntityManagerInterface $em, TrajetRepository $trajetRepository, ReservationRepository $reservationRepository): JsonResponse
{
    $data = json_decode($request->getContent(), true);

    // Récupérer le trajet demandé
    if (!isset($data['trajet_id'])) {
        return $this->json(['message' => 'trajet_id est requis'], JsonResponse::HTTP_BAD_REQUEST);
    }

    $trajet = $trajetRepository->find($data['trajet_id']);
    if (!$trajet) {
        return $this->json(['message' => 'Trajet non trouvé'], JsonResponse::HTTP_NOT_FOUND);
    }

    // Récupérer l'utilisateur connecté
    $user = $this->getUser();
    if (!$user) {
        return $this->json(['message' => 'Utilisateur non authentifié'], JsonResponse::HTTP_UNAUTHORIZED);
    }

    // 🔁 Vérifier si une réservation existe déjà pour ce trajet et cet utilisateur
    $reservationExistante = $reservationRepository->findOneBy([
        'user' => $user,
        'trajet' => $trajet
    ]);

    if ($reservationExistante) {
        return $this->json(['message' => 'Déjà réservé'], JsonResponse::HTTP_BAD_REQUEST);
    }

    // 📉 Vérifier s’il reste des places disponibles
    $placesTotal = $trajet->getPlaces(); // Places disponibles initiales
    $reservations = $trajet->getReservations(); // Toutes les réservations liées
    $placesReservées = array_reduce($reservations->toArray(), fn($carry, $r) => $carry + $r->getPlaces(), 0);

    $placesRestantes = $placesTotal - $placesReservées;

    if ($placesRestantes <= 0) {
        return $this->json(['message' => 'Trajet complet'], JsonResponse::HTTP_BAD_REQUEST);
    }

    // 🔧 Créer la réservation
    $reservation = new \App\Entity\Reservation();
    $reservation->setUser($user);
    $reservation->setTrajet($trajet);

    // Par défaut : 1 place réservée
    $nbPlaces = isset($data['places']) ? (int)$data['places'] : 1;
    if ($nbPlaces > $placesRestantes) {
        return $this->json(['message' => 'Pas assez de places disponibles'], JsonResponse::HTTP_BAD_REQUEST);
    }

    $reservation->setPlaces($nbPlaces);

    $em->persist($reservation);
    $em->flush();

    return $this->json(['message' => 'Réservation créée'], JsonResponse::HTTP_CREATED);
}
}