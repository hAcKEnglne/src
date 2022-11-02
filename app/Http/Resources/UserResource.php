<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'email' => $this->email,
            'nome' => ucfirst($this->nome),
            'cognome' => ucfirst($this->cognome),
            'ruolo' => $this->ruolo,
            //'_links' => $this->links()
        ];
    }

    // Funzione per la restituzione di tutti gli admin
    // $this->ruolo == 1
}