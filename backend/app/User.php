<?php

namespace App;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    //

    protected $table = "users";
    protected
    $fillable = [
        'full_name',
        'password',
        'phone',
        'email',
        'role_id'
    ];

    public
    function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public
    function getJWTCustomClaims()
    {
        return [];
    }
}
