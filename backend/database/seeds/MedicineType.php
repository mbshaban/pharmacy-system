<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MedicineType extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('medicine_types')->insert([
            [
                "title"=> "pomade"
            ],
            [
                "title"=> "syrup"
            ],
            [
                "title"=> "tablet"
            ],
            [
                "title"=> "injection"
            ],
            [
                "title"=> "drop"
            ],
            [
                "title"=> "surgery"
            ],
            [
                "title"=> "capsule"
            ]

        ]);
    }
}
