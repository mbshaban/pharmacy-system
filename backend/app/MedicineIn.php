<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class MedicineIn extends Model
{
    protected $table = "medicine_stock_in";
    protected $fillable = [
        'medicine_id',
        'medicine_main_packing_id',
        'quantity',
        'medicine_price_in',
        'medicine_price_out',
        'user_id',
        'medicine_expire_date',
    ];
}
