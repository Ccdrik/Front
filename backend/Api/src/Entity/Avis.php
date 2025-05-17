<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: "App\Repository\AvisRepository")]
class Avis
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: "integer")]
    private ?int $id = null;

    #[ORM\Column(type: "text")]
    private string $commentaire;

    #[ORM\Column(type: "integer")]
    private int $note; // Ex: 1 à 5

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: "avisDonnes")]
    #[ORM\JoinColumn(nullable: false)]
    private User $auteur;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: "avisRecus")]
    #[ORM\JoinColumn(nullable: true)]
    private ?User $destinataire = null; // Si avis sur conducteur

    #[ORM\ManyToOne(targetEntity: Trajet::class, inversedBy: "avis")]
    #[ORM\JoinColumn(nullable: true)]
    private ?Trajet $trajet = null; // Si avis sur trajet

    #[ORM\Column(type: "datetime")]
    private \DateTimeInterface $datePublication;

    // Getters & Setters

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCommentaire(): string
    {
        return $this->commentaire;
    }

    public function setCommentaire(string $commentaire): self
    {
        $this->commentaire = $commentaire;
        return $this;
    }

    public function getNote(): int
    {
        return $this->note;
    }

    public function setNote(int $note): self
    {
        $this->note = $note;
        return $this;
    }

    public function getAuteur(): User
    {
        return $this->auteur;
    }

    public function setAuteur(User $auteur): self
    {
        $this->auteur = $auteur;
        return $this;
    }

    public function getDestinataire(): ?User
    {
        return $this->destinataire;
    }

    public function setDestinataire(?User $destinataire): self
    {
        $this->destinataire = $destinataire;
        return $this;
    }

    public function getTrajet(): ?Trajet
    {
        return $this->trajet;
    }

    public function setTrajet(?Trajet $trajet): self
    {
        $this->trajet = $trajet;
        return $this;
    }

    public function getDatePublication(): \DateTimeInterface
    {
        return $this->datePublication;
    }

    public function setDatePublication(\DateTimeInterface $datePublication): self
    {
        $this->datePublication = $datePublication;
        return $this;
    }
}
