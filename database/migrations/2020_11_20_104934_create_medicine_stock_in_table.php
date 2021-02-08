<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMedicineStockInTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('medicine_stock_in', function (Blueprint $table) {
            $table->id();
            $table->integer("medicine_id")->unsigned();
            $table->foreign('medicine_id')->references('id')->on('medicines');
            $table->integer("medicine_main_packing_id")->unsigned();
            $table->foreign('medicine_main_packing_id')->references('id')->on('packing_units');
            $table->float("quantity")->unsigned();
            $table->float("medicine_price_in")->unsigned();
            $table->float("medicine_price_out")->unsigned();
            $table->integer("user_id")->unsigned();
            $table->foreign('user_id')->references('id')->on('users');
            $table->date("medicine_expire_date");
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
        Schema::dropIfExists('medicine_stock_in');
    }
}
