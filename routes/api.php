<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\WasherController;
use App\Http\Controllers\WashingProgramController;
use App\Http\Controllers\ReservationController;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Models\User;
use App\Models\Washer;
use App\Models\WashingProgram;
use App\Models\Reservation;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

/*Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});*/

/*Route::get('/users/{id}', function ($id) {
    return [
        'lavasciuga' => Washer::find(1)->programmaLavaggio,
        'programma_lav' => WashingProgram::find(1)->lavasciuga
    ];
});*/

// PATCH washer
Route::patch('/washer/{washer}/enable', [WasherController::class, 'abilitaStato']);
Route::patch('/washer/{washer}/disable', [WasherController::class, 'disabilitaStato']);

// GET user
Route::get('/user/{ruolo}/all/', [UserController::class, 'index']);
Route::get('/user/{user_prenotazione}/{ruolo}/reservation/', [UserController::class, 'visualizzaPrenotazioni']);

// GET reservation
Route::get('/reservation/{reservation_parameter}', [ReservationController::class, 'show']);


