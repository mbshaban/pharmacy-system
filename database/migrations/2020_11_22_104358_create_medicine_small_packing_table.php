<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMedicineSmallPackingTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('medicine_small_packing', function (Blueprint $table) {
            $table->id();
            $table->bigInteger("medicine_stock_in_id")->unsigned();
            $table->foreign('medicine_stock_in_id')->references('id')->on('medicine_stock_in');
            $table->integer("medicine_packing_unit_id")->unsigned();
            $table->foreign('medicine_packing_unit_id')->references('id')->on('packing_units');
            $table->float("quantity")->unsigned();
            $table->float("medicine_price_out")->unsigned();
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
        Schema::dropIfExists('medicine_small_packing');
    }
}
