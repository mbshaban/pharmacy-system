<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MeasurementSeed extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('medicine_measurement_unit')->insert([
            [
                "title"=> "litter"
            ],
            [
                "title"=> "cc"
            ],
            [
                "title"=> "milligram"
            ],
            [
                "title"=> "gram"
            ]

        ]);
    }
}
