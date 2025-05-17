<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: "App\Repository\ReservationRepository")]
class Reservation
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type:"integer")]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: "reservations")]
    #[ORM\JoinColumn(nullable:false)]
    private User $passager;

    #[ORM\ManyToOne(targetEntity: Trajet::class, inversedBy: "reservations")]
    #[ORM\JoinColumn(nullable:false)]
    private Trajet $trajet;

    #[ORM\Column(type:"datetime")]
    private \DateTimeInterface $dateReservation;

    #[ORM\Column(type:"integer")]
    private int $placesReservees;

    public function getId(): ?int { return $this->id; }

    public function getPassager(): User { return $this->passager; }
    public function setPassager(User $passager): self { $this->passager = $passager; return $this; }

    public function getTrajet(): Trajet { return $this->trajet; }
    public function setTrajet(Trajet $trajet): self { $this->trajet = $trajet; return $this; }

    public function getDateReservation(): \DateTimeInterface { return $this->dateReservation; }
    public function setDateReservation(\DateTimeInterface $dateReservation): self { $this->dateReservation = $dateReservation; return $this; }

    public function getPlacesReservees(): int { return $this->placesReservees; }
    public function setPlacesReservees(int $placesReservees): self { $this->placesReservees = $placesReservees; return $this; }
}
