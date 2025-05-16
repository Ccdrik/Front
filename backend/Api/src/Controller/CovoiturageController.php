<?php

namespace App\Controller;

use App\Repository\CovoiturageRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class CovoiturageController extends AbstractController

{
   #[Route('/api/covoiturages', name: 'covoiturage_index', methods: ['GET'])]
public function index(CovoiturageRepository $covoiturageRepository): JsonResponse
{
    $covoiturages = $covoiturageRepository->findAll();
    return $this->json($covoiturages);
}

}



    // Vous pouvez également ajouter des méthodes pour créer,
    // mettre à jour ou supprimer un covoiturage.

