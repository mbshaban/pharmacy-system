<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PackingUnitsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('packing_units')->insert([
            [
                "title"=> "packet"
            ],
            [
                "title"=> "bottle"
            ],
            [
                "title"=> "piece"
            ],
            [
                "title"=> "can"
            ]

        ]);
    }
}
