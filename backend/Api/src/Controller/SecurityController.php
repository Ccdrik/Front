<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

class SecurityController extends AbstractController
{
    #[Route('/api/signin', name: 'api_signin', methods: ['POST'])]
    public function signin(#[CurrentUser] ?UserInterface $user): JsonResponse
    {
        if (!$user) {
            return $this->json([
                'success' => false,
                'error' => 'Identifiants invalides',
            ], 401);
        }

        return $this->json([
            'success' => true,
            'user' => [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'roles' => $user->getRoles(),
            ],
        ]);
    }
}
