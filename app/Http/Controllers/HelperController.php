<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HelperController extends Controller
{
    //
    public function getCommonData()
    {
        $roles = DB::table('roles')->select('id', 'title')->get();
        $medicineMeasUnites = DB::table('medicine_measurement_unit')->select('id', 'title')->get();
        $medicineType = DB::table('medicine_types')->select('id', 'title')->get();
        $packings = DB::table('packing_units')->select('id', 'title')->get();
        $medicines = DB::table('medicines')
            ->select(
                "medicine_stock_in.medicine_price_in",
                "medicine_stock_in.medicine_price_out as medicine_main_price_out",
                "medicines.id", "medicines.name",
                "medicines.company_name"
                , "medicine_measurement_unit.title"
                , "medicine_stock_in.totalIn"
                , "medicine_stock_in.id as medicine_stock_id"
                , "medicine_stock_out.totalOut",
                'medicine_stock_in.medicine_id'
                , "medicines.measurement_value",
                "medicines.measurement_unit_id",
                "medicines.medicine_type_id",
                "medicine_stock_in.medicine_main_packing_id",
                "medicine_small_packing.medicine_packing_unit_id"
                ,"medicine_small_packing.medicine_price_out as medicine_small_price_out")
            ->join("medicine_measurement_unit", 'medicine_measurement_unit.id', '=', 'medicines.measurement_unit_id')
            ->leftJoin(DB::raw("(SELECT id,SUM(quantity) as totalIn , medicine_price_out , medicine_id,medicine_price_in,medicine_main_packing_id FROM medicine_stock_in  GROUP BY medicine_id ORDER BY medicine_id DESC) as medicine_stock_in"), function ($join) {
                $join->on('medicine_stock_in.medicine_id', '=', 'medicines.id');
            })
            ->leftJoin(DB::raw("(SELECT SUM(quantity) as totalOut,medicine_id FROM medicine_stock_out  GROUP BY medicine_id ORDER BY medicine_id DESC) as medicine_stock_out"), function ($join) {
                $join->on('medicine_stock_out.medicine_id', '=', 'medicines.id');
            })
            ->leftJoin("medicine_small_packing", 'medicine_small_packing.medicine_stock_in_id', '=', 'medicine_stock_in.id')
            ->get();

        return response()->json([
            'roles' => $roles,
            'MedicineType' => $medicineType,
            'medicineMeasUnites' => $medicineMeasUnites,
            'medicines' => $medicines,
            'packings' => $packings
        ]);

    }

}
