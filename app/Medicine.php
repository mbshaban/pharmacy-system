<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Medicine extends Model
{
    protected $table = "medicines";
    protected $fillable = [
        'name',
        'company_name',
        'generic_name',
        'measurement_value',
        'measurement_unit_id',
        'medicine_type_id',
    ];
}
