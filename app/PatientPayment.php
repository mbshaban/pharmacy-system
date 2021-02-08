<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PatientPayment extends Model
{
    protected $table = "patient_payment";
    protected $fillable = [
        'patient_id',
        'payed_price',
        'bill_number',
    ];
}
