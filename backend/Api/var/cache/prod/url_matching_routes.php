<?php

/**
 * This file has been auto-generated
 * by the Symfony Routing Component.
 */

return [
    false, // $matchHost
    [ // $staticRoutes
        '/api/trajets' => [
            [['_route' => 'api_trajets_list', '_controller' => 'App\\Controller\\ApiController::listTrajets'], null, ['GET' => 0], null, false, false, null],
            [['_route' => 'api_trajets_create', '_controller' => 'App\\Controller\\ApiController::createTrajet'], null, ['POST' => 0], null, false, false, null],
        ],
        '/api/reservations' => [[['_route' => 'api_reservations_create', '_controller' => 'App\\Controller\\ApiController::createReservation'], null, ['POST' => 0], null, false, false, null]],
        '/api/mes-reservations' => [[['_route' => 'api_user_reservations', '_controller' => 'App\\Controller\\ApiController::getUserReservations'], null, ['GET' => 0], null, false, false, null]],
        '/api/signup' => [[['_route' => 'api_signup', '_controller' => 'App\\Controller\\AuthController::signup'], null, ['POST' => 0], null, false, false, null]],
        '/api/me' => [[['_route' => 'api_me', '_controller' => 'App\\Controller\\AuthController::me'], null, ['GET' => 0], null, false, false, null]],
        '/' => [[['_route' => 'home', '_controller' => 'App\\Controller\\MainController::index'], null, null, null, false, false, null]],
        '/reservations' => [[['_route' => 'reservation_index', '_controller' => 'App\\Controller\\ReservationController::index'], null, ['GET' => 0], null, true, false, null]],
        '/reservations/create' => [[['_route' => 'reservation_create', '_controller' => 'App\\Controller\\ReservationController::create'], null, ['POST' => 0], null, false, false, null]],
        '/api/signin' => [[['_route' => 'api_signin', '_controller' => 'App\\Controller\\SecurityController::signin'], null, ['POST' => 0], null, false, false, null]],
        '/api/users' => [[['_route' => 'api_users_list', '_controller' => 'App\\Controller\\UserController::listUsers'], null, ['GET' => 0], null, false, false, null]],
        '/api/check-email' => [[['_route' => 'api_check_email', '_controller' => 'App\\Controller\\UserController::checkEmail'], null, ['GET' => 0], null, false, false, null]],
        '/api/check-pseudo' => [[['_route' => 'api_check_pseudo', '_controller' => 'App\\Controller\\UserController::checkPseudo'], null, ['GET' => 0], null, false, false, null]],
    ],
    [ // $regexpList
        0 => '{^(?'
                .'|/api/(?'
                    .'|trajets/(?'
                        .'|([^/]++)(*:34)'
                        .'|search(*:47)'
                        .'|([^/]++)(?'
                            .'|(*:65)'
                        .')'
                    .')'
                    .'|reservations/([^/]++)(*:95)'
                .')'
            .')/?$}sDu',
    ],
    [ // $dynamicRoutes
        34 => [[['_route' => 'api_trajets_show', '_controller' => 'App\\Controller\\ApiController::showTrajet'], ['id'], ['GET' => 0], null, false, true, null]],
        47 => [[['_route' => 'api_trajets_search', '_controller' => 'App\\Controller\\ApiController::searchTrajets'], [], ['GET' => 0], null, false, false, null]],
        65 => [
            [['_route' => 'api_trajets_update', '_controller' => 'App\\Controller\\ApiController::updateTrajet'], ['id'], ['PUT' => 0], null, false, true, null],
            [['_route' => 'api_trajets_delete', '_controller' => 'App\\Controller\\ApiController::deleteTrajet'], ['id'], ['DELETE' => 0], null, false, true, null],
        ],
        95 => [
            [['_route' => 'api_reservations_delete', '_controller' => 'App\\Controller\\ApiController::deleteReservation'], ['id'], ['DELETE' => 0], null, false, true, null],
            [null, null, null, null, false, false, 0],
        ],
    ],
    null, // $checkCondition
];
