<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call(MeasurementSeed::class);
        $this->call(RolesSeeder::class);
        $this->call(MedicineType::class);
        $this->call(UserSeeder::class);
        $this->call(PackingUnitsSeeder::class);
    }
}
