<?php

namespace App\Entity;

use App\Repository\TrajetRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: TrajetRepository::class)]
class Trajet
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $villeDepart = null;

    #[ORM\Column(length: 255)]
    private ?string $villeArrivee = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $dateDepart = null;

    #[ORM\Column]
    private ?int $nbPlaces = null;

    #[ORM\Column]
    private ?float $prix = null;

    #[ORM\Column(type: 'boolean')]
    private bool $ecologique = false;


    #[ORM\ManyToOne(inversedBy: 'trajets')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $chauffeur = null;

    #[ORM\OneToMany(mappedBy: 'trajet', targetEntity: Reservation::class, orphanRemoval: true)]
    private Collection $reservations;

    public function __construct()
    {
        $this->reservations = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getVilleDepart(): ?string
    {
        return $this->villeDepart;
    }

    public function setVilleDepart(string $villeDepart): self
    {
        $this->villeDepart = $villeDepart;
        return $this;
    }

    public function getVilleArrivee(): ?string
    {
        return $this->villeArrivee;
    }

    public function setVilleArrivee(string $villeArrivee): self
    {
        $this->villeArrivee = $villeArrivee;
        return $this;
    }

    public function getDateDepart(): ?\DateTimeImmutable
    {
        return $this->dateDepart;
    }

    public function setDateDepart(\DateTimeImmutable $dateDepart): self
    {
        $this->dateDepart = $dateDepart;
        return $this;
    }

    public function getNbPlaces(): ?int
    {
        return $this->nbPlaces;
    }

    public function setNbPlaces(int $nbPlaces): self
    {
        $this->nbPlaces = $nbPlaces;
        return $this;
    }

    public function getPrix(): ?float
    {
        return $this->prix;
    }

    public function setPrix(float $prix): self
    {
        $this->prix = $prix;
        return $this;
    }

    public function isEcologique(): ?bool
    {
        return $this->ecologique;
    }
    public function setEcologique(bool $ecologique): self
    {
        $this->ecologique = $ecologique;
        return $this;
    }


    
    public function getChauffeur(): ?User
    {
        return $this->chauffeur;
    }

    public function setChauffeur(User $chauffeur): self
    {
        $this->chauffeur = $chauffeur;
        return $this;
    }

    /** @return Collection<int, Reservation> */
    public function getReservations(): Collection
    {
        return $this->reservations;
    }

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
        $this->reservations->removeElement($reservation);
        return $this;
    }
}
