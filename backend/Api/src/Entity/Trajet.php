<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: "App\Repository\TrajetRepository")]
class Trajet
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type:"integer")]
    private ?int $id = null;

    #[ORM\Column(type:"string", length:255)]
    private string $depart;

    #[ORM\Column(type:"string", length:255)]
    private string $destination;

    #[ORM\Column(type:"datetime")]
    private \DateTimeInterface $dateDepart;

    #[ORM\Column(type:"float")]
    private float $prix;

    #[ORM\Column(type:"integer")]
    private int $placesDisponibles;

    // Relations

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: "trajets")]
    #[ORM\JoinColumn(nullable:false)]
    private User $conducteur;

    #[ORM\OneToMany(mappedBy: "trajet", targetEntity: Reservation::class, cascade:["persist", "remove"])]
    private Collection $reservations;

    #[ORM\OneToMany(mappedBy: "trajet", targetEntity: Avis::class, cascade:["persist", "remove"])]
    private Collection $avis;

    public function __construct()
    {
        $this->reservations = new ArrayCollection();
        $this->avis = new ArrayCollection();
    }

    // Getters / setters

    public function getId(): ?int { return $this->id; }

    public function getDepart(): string { return $this->depart; }
    public function setDepart(string $depart): self { $this->depart = $depart; return $this; }

    public function getDestination(): string { return $this->destination; }
    public function setDestination(string $destination): self { $this->destination = $destination; return $this; }

    public function getDateDepart(): \DateTimeInterface { return $this->dateDepart; }
    public function setDateDepart(\DateTimeInterface $dateDepart): self { $this->dateDepart = $dateDepart; return $this; }

    public function getPrix(): float { return $this->prix; }
    public function setPrix(float $prix): self { $this->prix = $prix; return $this; }

    public function getPlacesDisponibles(): int { return $this->placesDisponibles; }
    public function setPlacesDisponibles(int $placesDisponibles): self { $this->placesDisponibles = $placesDisponibles; return $this; }

    public function getConducteur(): User { return $this->conducteur; }
    public function setConducteur(User $conducteur): self { $this->conducteur = $conducteur; return $this; }

    public function getReservations(): Collection { return $this->reservations; }
    public function addReservation(Reservation $reservation): self
    {
        if (!$this->reservations->contains($reservation)) {
            $this->reservations[] = $reservation;
            $reservation->setTrajet($this);
        }
        return $this;
    }
    public function removeReservation(Reservation $reservation): self
    {
        if ($this->reservations->removeElement($reservation)) {
            if ($reservation->getTrajet() === $this) {
                $reservation->setTrajet(null);
            }
        }
        return $this;
    }

    public function getAvis(): Collection { return $this->avis; }
    public function addAvis(Avis $avis): self
    {
        if (!$this->avis->contains($avis)) {
            $this->avis[] = $avis;
            $avis->setTrajet($this);
        }
        return $this;
    }
    public function removeAvis(Avis $avis): self
    {
        if ($this->avis->removeElement($avis)) {
            if ($avis->getTrajet() === $this) {
                $avis->setTrajet(null);
            }
        }
        return $this;
    }
}
