<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePatientPayment extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('patient_payment', function (Blueprint $table) {
            $table->increments("id");
            $table->integer("patient_id")->unsigned();
            $table->foreign('patient_id')->references('id')->on('patients');
            $table->integer("payed_price")->unsigned();
            $table->integer("bill_number")->unsigned();
            $table->foreign('bill_number')->references('bill_number')->on('general_stock_out_number');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('patient_payment');
    }
}
