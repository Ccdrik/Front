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
        $data = json_decode($request->getContent(), true);

        if (!$data) {
            return new JsonResponse(['error' => 'Données manquantes ou format invalide'], 400);
        }

        $email = $data['email'] ?? null;
        $password = $data['motdepasse'] ?? null;
        $confirmation = $data['confirmationpassword'] ?? null;
        $nom = $data['nom'] ?? null;
        $prenom = $data['prenom'] ?? null;
        $pseudo = $data['pseudo'] ?? null;
        $rolesFromRequest = $data['roles'] ?? []; // Ajouté

        if (!$email || !$password || !$confirmation || !$nom || !$prenom || !$pseudo) {
            return new JsonResponse(['error' => 'Champs manquants'], 400);
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return new JsonResponse(['error' => 'Email invalide'], 400);
        }

        if ($password !== $confirmation) {
            return new JsonResponse(['error' => 'Les mots de passe ne correspondent pas'], 400);
        }

        $existingUser = $em->getRepository(User::class)->findOneBy(['email' => $email]);
        if ($existingUser) {
            return new JsonResponse(['error' => 'Email déjà utilisé'], 400);
        }

        $user = new User();
        $user->setEmail($email);
        $user->setPassword($hasher->hashPassword($user, $password));
        $user->setNom($nom);
        $user->setPrenom($prenom);
        $user->setPseudo($pseudo);
        $user->setCredit(20);

        // Gestion dynamique des rôles
        $availableRoles = ['ROLE_PASSAGER', 'ROLE_CHAUFFEUR'];
        $filteredRoles = array_values(array_intersect($availableRoles, $rolesFromRequest));
        if (!empty($rolesFromRequest) && empty($filteredRoles)) {
            return new JsonResponse(['error' => 'Rôle(s) invalide(s) fourni(s)'], 400);
        }
        $user->setRoles(!empty($filteredRoles) ? $filteredRoles : ['ROLE_PASSAGER']);

        try {
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
            'available' => $user === null
        ]);
    }

    #[Route('/api/me', name: 'api_me', methods: ['GET'])]
    public function me(): JsonResponse
    {
        $user = $this->getUser();

        if (!$user) {
            return new JsonResponse(['error' => 'Non authentifié'], 401);
        }

        return new JsonResponse([
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'pseudo' => $user->getPseudo(),
            'roles' => $user->getRoles(),
            'nom' => $user->getNom(),
            'prenom' => $user->getPrenom(),
        ]);
    }
}
