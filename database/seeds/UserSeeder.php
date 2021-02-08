<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        DB::table('users')->insert([
            [
                'full_name' => 'superadmin',
                'password' => Hash::make('superadmin@@786'),
                'phone' => '0748822362',
                'role_id' => 1,
                'email' => 'pharmacy@medicine.co',
                'created_at' => \Illuminate\Support\Carbon::now(),
                'updated_at' => \Illuminate\Support\Carbon::now()
            ]

        ]);
    }
}
