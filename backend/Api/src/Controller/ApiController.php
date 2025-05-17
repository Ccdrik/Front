<?php
namespace App\Controller;

use App\Entity\Trajet;
use App\Entity\Reservation;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class ApiController extends AbstractController
{
    private $em;

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    #[Route('/api/trajets', name: 'api_trajets_list', methods: ['GET'])]
    public function listTrajets(): JsonResponse
    {
        $trajets = $this->em->getRepository(Trajet::class)->findAll();

        $data = [];
        foreach ($trajets as $trajet) {
            $data[] = [
                'id' => $trajet->getId(),
                'chauffeur' => [
                    'id' => $trajet->getChauffeur()->getId(),
                    'email' => $trajet->getChauffeur()->getEmail(),
                ],
                'dateDepart' => $trajet->getDateDepart()->format('Y-m-d H:i:s'),
                'depart' => $trajet->getDepart(),
                'destination' => $trajet->getDestination(),
                'places' => $trajet->getPlaces(),
                'prix' => $trajet->getPrix(),
                'description' => $trajet->getDescription(),
            ];
        }

        return new JsonResponse($data, 200);
    }

    #[Route('/api/trajets', name: 'api_trajets_create', methods: ['POST'])]
    public function createTrajet(Request $request): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'Non authentifié'], 401);
        }

        $data = json_decode($request->getContent(), true);

        if (!$data) {
            return new JsonResponse(['error' => 'Données manquantes ou invalides'], 400);
        }

        try {
            $trajet = new Trajet();
            $trajet->setChauffeur($user);
            $trajet->setDateDepart(new \DateTime($data['dateDepart'] ?? 'now'));
            $trajet->setDepart($data['depart'] ?? '');
            $trajet->setDestination($data['destination'] ?? '');
            $trajet->setPlaces($data['places'] ?? 0);
            $trajet->setPrix($data['prix'] ?? 0);
            $trajet->setDescription($data['description'] ?? null);

            $this->em->persist($trajet);
            $this->em->flush();

            return new JsonResponse(['success' => 'Trajet créé', 'id' => $trajet->getId()], 201);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Erreur lors de la création du trajet : '.$e->getMessage()], 500);
        }
    }

    #[Route('/api/reservations', name: 'api_reservations_create', methods: ['POST'])]
public function createReservation(Request $request): JsonResponse
{
    $user = $this->getUser();
    if (!$user) {
        return new JsonResponse(['error' => 'Non authentifié'], 401);
    }

    $data = json_decode($request->getContent(), true);

    if (!$data || !isset($data['trajetId']) || !isset($data['placesReservees'])) {
        return new JsonResponse(['error' => 'Données manquantes ou invalides'], 400);
    }

    $trajet = $this->em->getRepository(Trajet::class)->find($data['trajetId']);
    if (!$trajet) {
        return new JsonResponse(['error' => 'Trajet introuvable'], 404);
    }

    $reservation = new Reservation();
    $reservation->setUser($user);
    $reservation->setTrajet($trajet);
    $reservation->setPlacesReservees($data['placesReservees']);

    $this->em->persist($reservation);
    $this->em->flush();

    return new JsonResponse(['success' => 'Réservation créée'], 201);
}
}