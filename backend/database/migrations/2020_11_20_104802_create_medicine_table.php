<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMedicineTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('medicines', function (Blueprint $table) {
            $table->increments("id");
            $table->string("name");
            $table->string("company_name");
            $table->string("generic_name");
            $table->unsignedFloat("measurement_value");
            $table->unsignedInteger("measurement_unit_id");
            $table->foreign('measurement_unit_id')->references('id')->on('medicine_measurement_unit');
            $table->unsignedInteger("medicine_type_id");
            $table->foreign('medicine_type_id')->references('id')->on('medicine_types');
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
        Schema::dropIfExists('medicine');
    }
}
