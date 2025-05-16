<?php

namespace App\Entity;

use App\Repository\CovoiturageRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Table(name: "covoiturage")]
#[ORM\Entity(repositoryClass: CovoiturageRepository::class)]
class Covoiturage
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $lieuDepart = null;

    #[ORM\Column(length: 255)]
    private ?string $lieuArrivee = null;

    #[ORM\Column]
    private ?\DateTime $dateDepart = null;

    #[ORM\Column]
    private ?float $prix = null;

    #[ORM\Column]
    private ?int $placeDisponible = null;

    // Le chauffeur qui crée le covoiturage (relation ManyToOne)
    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'covoiturages')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $chauffeur = null;

    // Le véhicule utilisé, par exemple
    #[ORM\ManyToOne(inversedBy: 'covoiturages')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Voiture $vehiculeUtilise = null;

    // Les passagers qui participent au covoiturage (relation ManyToMany)
    #[ORM\ManyToMany(targetEntity: User::class, inversedBy: 'passagerCovoiturages')]
    #[ORM\JoinTable(name: 'covoiturage_passagers')]
    private Collection $passagers;

    public function __construct()
    {
        $this->passagers = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getLieuDepart(): ?string
    {
        return $this->lieuDepart;
    }

    public function setLieuDepart(string $lieuDepart): static
    {
        $this->lieuDepart = $lieuDepart;
        return $this;
    }

    public function getLieuArrivee(): ?string
    {
        return $this->lieuArrivee;
    }

    public function setLieuArrivee(string $lieuArrivee): static
    {
        $this->lieuArrivee = $lieuArrivee;
        return $this;
    }

    public function getDateDepart(): ?\DateTime
    {
        return $this->dateDepart;
    }

    public function setDateDepart(\DateTime $dateDepart): static
    {
        $this->dateDepart = $dateDepart;
        return $this;
    }

    public function getPrix(): ?float
    {
        return $this->prix;
    }

    public function setPrix(float $prix): static
    {
        $this->prix = $prix;
        return $this;
    }

    public function getPlaceDisponible(): ?int
    {
        return $this->placeDisponible;
    }

    public function setPlaceDisponible(int $placeDisponible): static
    {
        $this->placeDisponible = $placeDisponible;
        return $this;
    }

    public function getChauffeur(): ?User
    {
        return $this->chauffeur;
    }

    public function setChauffeur(?User $chauffeur): self
    {
        $this->chauffeur = $chauffeur;
        return $this;
    }

    public function getVehiculeUtilise(): ?Voiture
    {
        return $this->vehiculeUtilise;
    }

    public function setVehiculeUtilise(?Voiture $vehiculeUtilise): static
    {
        $this->vehiculeUtilise = $vehiculeUtilise;
        return $this;
    }

    /**
     * @return Collection<int, User>
     */
    public function getPassagers(): Collection
    {
        return $this->passagers;
    }

    public function addPassager(User $user): self
    {
        if (!$this->passagers->contains($user)) {
            $this->passagers->add($user);
            // Optionnel si tu gères la relation bidirectionnelle dans User :
            // $user->addPassagerCovoiturage($this);
        }
        return $this;
    }

    public function removePassager(User $user): self
    {
        $this->passagers->removeElement($user);
        // Optionnel également si besoin de retirer la relation dans User :
        // $user->removePassagerCovoiturage($this);
        return $this;
    }
}
