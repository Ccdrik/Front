<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: "App\Repository\PreferenceRepository")]
class Preference
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type:"integer")]
    private ?int $id = null;

    #[ORM\Column(type:"string", length:100)]
    private string $cle;

    #[ORM\Column(type:"string", length:255)]
    private string $valeur;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: "preferences")]
    #[ORM\JoinColumn(nullable:false)]
    private User $user;

    public function getId(): ?int { return $this->id; }

    public function getCle(): string { return $this->cle; }
    public function setCle(string $cle): self { $this->cle = $cle; return $this; }

    public function getValeur(): string { return $this->valeur; }
    public function setValeur(string $valeur): self { $this->valeur = $valeur; return $this; }

    public function getUser(): User { return $this->user; }
    public function setUser(User $user): self { $this->user = $user; return $this; }
}