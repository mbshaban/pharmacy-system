<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class MedicineInSmallPacking extends Model
{
    protected $table = "medicine_small_packing";
    protected $fillable = [
        'medicine_stock_in_id',
        'medicine_packing_unit_id',
        'quantity',
        'medicine_price_out',

    ];
}
