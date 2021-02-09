<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class MedicineOut extends Model
{
    protected $table = "medicine_stock_out";
    protected $fillable = [
        'medicine_id',
        'medicine_main_packing_id',
        'quantity',
        'user_id',
        'patient_id',
        'medicine_stock_in_id',
        'bill_number',
    ];
}
