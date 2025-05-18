<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DefaultController extends AbstractController
{
    /**
     * Cette route capte toutes les URL non définies ailleurs.
     *
     * @Route("/{reactRouting}", name="homepage", requirements={"reactRouting"=".+"})
     */
    public function index(): Response
    {
        // Rendu du template de base qui servira ton SPA.
        return $this->render('base.html.twig');
    }
}
