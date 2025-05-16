<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class ApiController extends AbstractController
{
    #[Route('/api', name: 'api_home')]
    public function index(): JsonResponse
    {
        return new JsonResponse(['message' => 'Bienvenue sur l\'API EcoRide!']);
    }
}
