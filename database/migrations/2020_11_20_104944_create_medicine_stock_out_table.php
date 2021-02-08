<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMedicineStockOutTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('medicine_stock_out', function (Blueprint $table) {
            $table->id();
            $table->integer("medicine_id")->unsigned();
            $table->foreign('medicine_id')->references('id')->on('medicines');
            $table->integer("medicine_main_packing_id")->unsigned();
            $table->foreign('medicine_main_packing_id')->references('id')->on('packing_units');
            $table->float("quantity")->unsigned();
            $table->integer("user_id")->unsigned();
            $table->foreign('user_id')->references('id')->on('users');
            $table->integer("patient_id")->unsigned();
            $table->foreign('patient_id')->references('id')->on('patients');
            $table->integer("bill_number")->unsigned();
            $table->foreign('bill_number')->references('bill_number')->on('general_stock_out_number');
            $table->bigInteger("medicine_stock_in_id")->unsigned();
            $table->foreign('medicine_stock_in_id')->references('id')->on('medicine_stock_in');
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
        Schema::dropIfExists('medicine_stock_out');
    }
}
