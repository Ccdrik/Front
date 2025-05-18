<?php

namespace App\Controller;

use App\Entity\Trajet;
use App\Entity\Reservation;
use App\Entity\User;
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
                'villeDepart' => $trajet->getVilleDepart(),
                'villeArrivee' => $trajet->getVilleArrivee(),
                'nbPlaces' => $trajet->getNbPlaces(),
                'ecologique' => $trajet->getEcologique(),
                'prix' => $trajet->getPrix(),
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
            $trajet->setDateDepart(new \DateTimeImmutable($data['dateDepart'] ?? 'now'));
            $trajet->setVilleDepart($data['villeDepart'] ?? '');
            $trajet->setVilleArrivee($data['villeArrivee'] ?? '');
            $trajet->setNbPlaces($data['nbPlaces'] ?? 0);
            $trajet->setEcologique($data['ecologique'] ?? false);
            $trajet->setPrix($data['prix'] ?? 0);

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

    if ($trajet->getNbPlaces() < $data['placesReservees']) {
        return new JsonResponse(['error' => 'Pas assez de places disponibles'], 400);
    }

    $reservation = new Reservation();
    // Correction ici : setPassager au lieu de setUser
    $reservation->setPassager($user);
    $reservation->setTrajet($trajet);
    // Correction ici : setNbPlacesReservees au lieu de setPlacesReservees
    $reservation->setNbPlacesReservees($data['placesReservees']);

    // Mise à jour du nombre de places restantes
    $trajet->setNbPlaces($trajet->getNbPlaces() - $data['placesReservees']);

    $this->em->persist($reservation);
    $this->em->flush();

    return new JsonResponse(['success' => 'Réservation créée'], 201);
}


    #[Route('/api/trajets/{id}', name: 'api_trajets_show', methods: ['GET'])]
    public function showTrajet(int $id): JsonResponse
    {
        $trajet = $this->em->getRepository(Trajet::class)->find($id);

        if (!$trajet) {
            return new JsonResponse(['error' => 'Trajet introuvable'], 404);
        }

        $data = [
            'id' => $trajet->getId(),
            'chauffeur' => [
                'id' => $trajet->getChauffeur()->getId(),
                'email' => $trajet->getChauffeur()->getEmail(),
            ],
            'dateDepart' => $trajet->getDateDepart()->format('Y-m-d H:i:s'),
            'villeDepart' => $trajet->getVilleDepart(),
            'villeArrivee' => $trajet->getVilleArrivee(),
            'nbPlaces' => $trajet->getNbPlaces(),
            'ecologique' => $trajet->getEcologique(),
            'prix' => $trajet->getPrix(),
        ];

        return new JsonResponse($data, 200);
    }

    #[Route('/api/mes-reservations', name: 'api_user_reservations', methods: ['GET'])]
public function getUserReservations(): JsonResponse
{
    $user = $this->getUser();
    if (!$user) {
        return new JsonResponse(['error' => 'Non authentifié'], 401);
    }

    // ici on cherche les réservations par passager
    $reservations = $this->em->getRepository(Reservation::class)->findBy(['passager' => $user]);

    $data = [];
    foreach ($reservations as $reservation) {
        $trajet = $reservation->getTrajet();
        $data[] = [
            'reservationId' => $reservation->getId(),
            'placesReservees' => $reservation->getNbPlacesReservees(),
            'trajet' => [
                'id' => $trajet->getId(),
                'villeDepart' => $trajet->getVilleDepart(),
                'villeArrivee' => $trajet->getVilleArrivee(),
                'dateDepart' => $trajet->getDateDepart()->format('Y-m-d H:i:s'),
                'prix' => $trajet->getPrix(),
            ]
        ];
    }

    return new JsonResponse($data, 200);
}


    #[Route('/api/trajets/search', name: 'api_trajets_search', methods: ['GET'])]
    public function searchTrajets(Request $request): JsonResponse
    {
        $villeDepart = $request->query->get('villeDepart');
        $villeArrivee = $request->query->get('villeArrivee');
        $date = $request->query->get('date');

        $qb = $this->em->getRepository(Trajet::class)->createQueryBuilder('t');

        if ($villeDepart) {
            $qb->andWhere('t.villeDepart = :villeDepart')->setParameter('villeDepart', $villeDepart);
        }
        if ($villeArrivee) {
            $qb->andWhere('t.villeArrivee = :villeArrivee')->setParameter('villeArrivee', $villeArrivee);
        }
        if ($date) {
            $startDate = new \DateTimeImmutable($date . ' 00:00:00');
            $endDate = new \DateTimeImmutable($date . ' 23:59:59');
            $qb->andWhere('t.dateDepart BETWEEN :start AND :end')
               ->setParameter('start', $startDate)
               ->setParameter('end', $endDate);
        }

        $trajets = $qb->getQuery()->getResult();

        $data = [];
        foreach ($trajets as $trajet) {
            $data[] = [
                'id' => $trajet->getId(),
                'villeDepart' => $trajet->getVilleDepart(),
                'villeArrivee' => $trajet->getVilleArrivee(),
                'dateDepart' => $trajet->getDateDepart()->format('Y-m-d H:i:s'),
                'nbPlaces' => $trajet->getNbPlaces(),
                'ecologique' => $trajet->getEcologique(),
                'prix' => $trajet->getPrix(),
            ];
        }

        return new JsonResponse($data, 200);
    }

    #[Route('/api/trajets/{id}', name: 'api_trajets_update', methods: ['PUT'])]
public function updateTrajet(int $id, Request $request): JsonResponse
{
    $user = $this->getUser();
    if (!$user) {
        return new JsonResponse(['error' => 'Non authentifié'], 401);
    }

    $trajet = $this->em->getRepository(Trajet::class)->find($id);
    if (!$trajet) {
        return new JsonResponse(['error' => 'Trajet introuvable'], 404);
    }

    // Vérifier que l'utilisateur est le chauffeur du trajet
    if ($trajet->getChauffeur()->getId() !== $user->getId()) {
        return new JsonResponse(['error' => 'Accès refusé'], 403);
    }

    $data = json_decode($request->getContent(), true);
    if (!$data) {
        return new JsonResponse(['error' => 'Données invalides'], 400);
    }

    // Mise à jour des champs
    if (isset($data['villeDepart'])) {
        $trajet->setVilleDepart($data['villeDepart']);
    }
    if (isset($data['villeArrivee'])) {
        $trajet->setVilleArrivee($data['villeArrivee']);
    }
    if (isset($data['dateDepart'])) {
        $trajet->setDateDepart(new \DateTimeImmutable($data['dateDepart']));
    }
    if (isset($data['nbPlaces'])) {
        $trajet->setNbPlaces((int)$data['nbPlaces']);
    }
    if (isset($data['ecologique'])) {
    $trajet->setEcologique((bool)$data['ecologique']);
    }
    if (isset($data['prix'])) {
        $trajet->setPrix((float)$data['prix']);
    }

    $this->em->flush();

    return new JsonResponse(['success' => 'Trajet mis à jour']);
}

#[Route('/api/trajets/{id}', name: 'api_trajets_delete', methods: ['DELETE'])]
public function deleteTrajet(int $id): JsonResponse
{
    $user = $this->getUser();
    if (!$user) {
        return new JsonResponse(['error' => 'Non authentifié'], 401);
    }

    $trajet = $this->em->getRepository(Trajet::class)->find($id);
    if (!$trajet) {
        return new JsonResponse(['error' => 'Trajet introuvable'], 404);
    }

    // Vérifie que l'utilisateur est bien le chauffeur du trajet
    if ($trajet->getChauffeur()->getId() !== $user->getId()) {
        return new JsonResponse(['error' => 'Accès refusé'], 403);
    }

    $this->em->remove($trajet);
    $this->em->flush();

    return new JsonResponse(['success' => 'Trajet supprimé']);
}


#[Route('/api/reservations/{id}', name: 'api_reservations_delete', methods: ['DELETE'])]
public function deleteReservation(int $id): JsonResponse
{
    $user = $this->getUser();
    if (!$user) {
        return new JsonResponse(['error' => 'Non authentifié'], 401);
    }

    $reservation = $this->em->getRepository(Reservation::class)->find($id);
    if (!$reservation) {
        return new JsonResponse(['error' => 'Réservation introuvable'], 404);
    }

    // Vérifier que l'utilisateur est bien le passager de la réservation
    if ($reservation->getPassager()->getId() !== $user->getId()) {
        return new JsonResponse(['error' => 'Accès refusé'], 403);
    }

    // Restaurer le nombre de places dans le trajet
    $trajet = $reservation->getTrajet();
    $trajet->setNbPlaces($trajet->getNbPlaces() + $reservation->getNbPlacesReservees());

    $this->em->remove($reservation);
    $this->em->flush();

    return new JsonResponse(['success' => 'Réservation supprimée']);
}

}
