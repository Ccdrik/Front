<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;

#[ORM\Entity(repositoryClass: "App\Repository\UserRepository")]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type:"integer")]
    private ?int $id = null;

    #[ORM\Column(type:"string", length:180, unique:true)]
    private string $email;

    #[ORM\Column(type:"json")]
    private array $roles = [];

    #[ORM\Column(type:"string")]
    private string $password;

    #[ORM\Column(type:"string", length:50)]
    private string $prenom;

    #[ORM\Column(type:"string", length:50)]
    private string $nom;

    #[ORM\Column(type:"string", length:15, nullable:true)]
    private ?string $telephone = null;

    #[ORM\Column(type: "string", length: 255, nullable:true)]
    private ?string $pseudo = null;

    #[ORM\Column(type:"integer")]
    private int $credits = 20;

    #[ORM\OneToMany(mappedBy: "conducteur", targetEntity: Trajet::class, cascade:["persist", "remove"])]
    private Collection $trajets;

    #[ORM\OneToMany(mappedBy: "passager", targetEntity: Reservation::class, cascade:["persist", "remove"])]
    private Collection $reservations;

    #[ORM\OneToMany(mappedBy: "proprietaire", targetEntity: Voiture::class, cascade:["persist", "remove"])]
    private Collection $voitures;

    #[ORM\OneToMany(mappedBy: "auteur", targetEntity: Avis::class, cascade:["persist", "remove"])]
    private Collection $avisDonnes;

    #[ORM\OneToMany(mappedBy: "destinataire", targetEntity: Avis::class, cascade:["persist", "remove"])]
    private Collection $avisRecus;

    #[ORM\OneToMany(mappedBy: "user", targetEntity: Preference::class, cascade:["persist", "remove"])]
    private Collection $preferences;

    public function __construct()
    {
        $this->trajets = new ArrayCollection();
        $this->reservations = new ArrayCollection();
        $this->voitures = new ArrayCollection();
        $this->avisDonnes = new ArrayCollection();
        $this->avisRecus = new ArrayCollection();
        $this->preferences = new ArrayCollection();
    }

    // Getters & setters + UserInterface methods

    public function getId(): ?int { return $this->id; }

    public function getEmail(): string { return $this->email; }
    public function setEmail(string $email): self { $this->email = $email; return $this; }

    public function getUserIdentifier(): string { return $this->email; }

    public function getRoles(): array
    {
        $roles = $this->roles;
        if (!in_array('ROLE_USER', $roles)) {
            $roles[] = 'ROLE_USER';
        }
        return array_unique($roles);
    }
    public function setRoles(array $roles): self { $this->roles = $roles; return $this; }

    // Méthode requise par PasswordAuthenticatedUserInterface
    public function getPassword(): string { return $this->password; }
    public function setPassword(string $password): self { $this->password = $password; return $this; }

    public function eraseCredentials(): void {}

    public function getPrenom(): string { return $this->prenom; }
    public function setPrenom(string $prenom): self { $this->prenom = $prenom; return $this; }

    public function getNom(): string { return $this->nom; }
    public function setNom(string $nom): self { $this->nom = $nom; return $this; }

    public function getTelephone(): ?string { return $this->telephone; }
    public function setTelephone(?string $telephone): self { $this->telephone = $telephone; return $this; }

    public function getPseudo(): ?string { return $this->pseudo; }
    public function setPseudo(?string $pseudo): self { $this->pseudo = $pseudo; return $this; }

    public function getCredits(): int { return $this->credits; }
    public function setCredits(int $credits): self { $this->credits = $credits; return $this; }

    // Relations getters/setters

    public function getTrajets(): Collection { return $this->trajets; }
    public function addTrajet(Trajet $trajet): self
    {
        if (!$this->trajets->contains($trajet)) {
            $this->trajets[] = $trajet;
            $trajet->setConducteur($this);
        }
        return $this;
    }
    public function removeTrajet(Trajet $trajet): self
    {
        if ($this->trajets->removeElement($trajet)) {
            if ($trajet->getConducteur() === $this) {
                $trajet->setConducteur(null);
            }
        }
        return $this;
    }

    public function getReservations(): Collection { return $this->reservations; }
    public function addReservation(Reservation $reservation): self
    {
        if (!$this->reservations->contains($reservation)) {
            $this->reservations[] = $reservation;
            $reservation->setPassager($this);
        }
        return $this;
    }
    public function removeReservation(Reservation $reservation): self
    {
        if ($this->reservations->removeElement($reservation)) {
            if ($reservation->getPassager() === $this) {
                $reservation->setPassager(null);
            }
        }
        return $this;
    }

    public function getVoitures(): Collection { return $this->voitures; }
    public function addVoiture(Voiture $voiture): self
    {
        if (!$this->voitures->contains($voiture)) {
            $this->voitures[] = $voiture;
            $voiture->setProprietaire($this);
        }
        return $this;
    }
    public function removeVoiture(Voiture $voiture): self
    {
        if ($this->voitures->removeElement($voiture)) {
            if ($voiture->getProprietaire() === $this) {
                $voiture->setProprietaire(null);
            }
        }
        return $this;
    }

    public function getAvisDonnes(): Collection { return $this->avisDonnes; }
    public function addAvisDonne(Avis $avis): self
    {
        if (!$this->avisDonnes->contains($avis)) {
            $this->avisDonnes[] = $avis;
            $avis->setAuteur($this);
        }
        return $this;
    }
    public function removeAvisDonne(Avis $avis): self
    {
        if ($this->avisDonnes->removeElement($avis)) {
            if ($avis->getAuteur() === $this) {
                $avis->setAuteur(null);
            }
        }
        return $this;
    }

    public function getAvisRecus(): Collection { return $this->avisRecus; }
    public function addAvisRecu(Avis $avis): self
    {
        if (!$this->avisRecus->contains($avis)) {
            $this->avisRecus[] = $avis;
            $avis->setDestinataire($this);
        }
        return $this;
    }
    public function removeAvisRecu(Avis $avis): self
    {
        if ($this->avisRecus->removeElement($avis)) {
            if ($avis->getDestinataire() === $this) {
                $avis->setDestinataire(null);
            }
        }
        return $this;
    }

    public function getPreferences(): Collection { return $this->preferences; }
    public function addPreference(Preference $preference): self
    {
        if (!$this->preferences->contains($preference)) {
            $this->preferences[] = $preference;
            $preference->setUser($this);
        }
        return $this;
    }
    public function removePreference(Preference $preference): self
    {
        if ($this->preferences->removeElement($preference)) {
            if ($preference->getUser() === $this) {
                $preference->setUser(null);
            }
        }
        return $this;
    }
}
