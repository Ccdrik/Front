<?php

namespace App\Repository;

use App\Entity\Avis;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Avis>
 *
 * @method Avis|null find($id, $lockMode = null, $lockVersion = null)
 * @method Avis|null findOneBy(array $criteria, array $orderBy = null)
 * @method Avis[]    findAll()
 * @method Avis[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class AvisRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Avis::class);
    }

    // Exemple de méthode personnalisée : récupérer les avis avec note >= à une valeur donnée
    public function findByMinimumNote(int $noteMin): array
    {
        return $this->createQueryBuilder('a')
            ->andWhere('a.note >= :noteMin')
            ->setParameter('noteMin', $noteMin)
            ->orderBy('a.datePublication', 'DESC')
            ->getQuery()
            ->getResult();
    }
}
