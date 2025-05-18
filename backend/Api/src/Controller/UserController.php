<?php

namespace App\Controller;

use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class UserController extends AbstractController
{
    #[Route('/api/users', name: 'api_users_list', methods: ['GET'])]
    public function listUsers(UserRepository $userRepository): JsonResponse
    {
        $users = $userRepository->findAll();
        $data = [];
        foreach ($users as $user) {
            $data[] = [
                'id' => $user->getId(),
                'pseudo' => $user->getPseudo(),
                'email' => $user->getEmail(),
                // ... autres informations que tu souhaites exposer
            ];
        }

        return new JsonResponse($data);
    }

    #[Route('/api/check-email', name: 'api_check_email', methods: ['GET'])]
    public function checkEmail(UserRepository $userRepository, Request $request): JsonResponse
    {
        $email = $request->query->get('email');

        if (!$email) {
            return new JsonResponse(['error' => 'Email manquant'], 400);
        }

        $user = $userRepository->findOneBy(['email' => $email]);

        return new JsonResponse(['available' => !$user]);
    }

    #[Route('/api/check-pseudo', name: 'api_check_pseudo', methods: ['GET'])]
    public function checkPseudo(UserRepository $userRepository, Request $request): JsonResponse
    {
        $pseudo = $request->query->get('pseudo');

        if (!$pseudo) {
            return new JsonResponse(['error' => 'Pseudo manquant'], 400);
        }

        $user = $userRepository->findOneBy(['pseudo' => $pseudo]);

        return new JsonResponse(['available' => !$user]);
    }
}
