<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class AuthController extends AbstractController
{
    #[Route('/api/signup', name: 'api_signup', methods: ['POST'])]
    public function signup(Request $request, EntityManagerInterface $em, UserPasswordHasherInterface $hasher): JsonResponse
    {
        // Récupérer les données de la requête
        $data = json_decode($request->getContent(), true);

        if (!$data) {
            return new JsonResponse(['error' => 'Données manquantes ou format invalide'], 400);
        }

        // Validation des données reçues
        $email = $data['email'] ?? null;
        $password = $data['motdepasse'] ?? null;
        $confirmation = $data['confirmationpassword'] ?? null;
        $nom = $data['nom'] ?? null;
        $prenom = $data['prenom'] ?? null;

        // Validation des champs
        if (!$email || !$password || !$confirmation || !$nom || !$prenom) {
            return new JsonResponse(['error' => 'Champs manquants'], 400);
        }

        if ($password !== $confirmation) {
            return new JsonResponse(['error' => 'Les mots de passe ne correspondent pas'], 400);
        }

        // Créer un nouvel utilisateur
        $user = new User();
        $user->setEmail($email);
        $user->setPassword($hasher->hashPassword($user, $password));
        $user->setNom($nom);
        $user->setPrenom($prenom);
        $user->setRoles(['ROLE_PASSAGER']); // Rôle par défaut, à adapter selon l'input de l'utilisateur

        try {
            // Enregistrer l'utilisateur dans la base de données
            $em->persist($user);
            $em->flush();
            return new JsonResponse(['success' => 'Utilisateur créé'], 201);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Une erreur est survenue : ' . $e->getMessage()], 500);
        }
    }

#[Route('/api/check-email', name: 'api_check_email', methods: ['GET'])]
public function checkEmail(Request $request, EntityManagerInterface $em): JsonResponse
{
    $email = $request->query->get('email');

    if (!$email) {
        return new JsonResponse(['error' => 'Email manquant'], 400);
    }

    $user = $em->getRepository(User::class)->findOneBy(['email' => $email]);

    return new JsonResponse([
        'available' => $user === null  // true si dispo, false si déjà utilisé
    ]);
}
}
