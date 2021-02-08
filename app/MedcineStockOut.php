<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class MedcineStockOut extends Model
{
    protected $table = "medicine_stock_out";
    protected $fillable = [
        'medicine_id',
        'medicine_main_packing_id',
        'quantity',
        'patient_id',
        'user_id',
    ];
}
