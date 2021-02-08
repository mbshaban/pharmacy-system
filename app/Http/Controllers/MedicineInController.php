<?php

namespace App\Http\Controllers;

use App\Medicine;
use App\MedicineIn;
use App\MedicineInSmallPacking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MedicineInController extends Controller
{
    public function store(Request $request)
    {
        if($request->get("has_small_pack") === true){
            $this->smallValidator($request->all())->validate();
            try {
                $insertedData = MedicineIn::create([
                    'medicine_id'=>$request->get("medicine_id"),
                    'medicine_main_packing_id'=>$request->get("medicine_main_packing_id"),
                    'quantity'=>$request->get("quantity"),
                    'medicine_price_in'=> $request->get("medicine_price_in"),
                    'medicine_price_out'=> $request->get("medicine_price_out"),
                    'medicine_expire_date'=> $request->get("medicine_expire_date"),
                    'user_id'=> $request->get("user_id"),
                ]);
                MedicineInSmallPacking::create([
                    'medicine_stock_in_id'=>$insertedData->id,
                    'medicine_packing_unit_id'=>$request->get("sm_medicine_small_packing_id"),
                    'quantity'=>$request->get("sm_quantity"),
                    'medicine_price_out'=> $request->get("sm_medicine_price_out"),
                ]);
                return response()->json($request->all());
            } catch (\Exception $exception) {
                return response()->json([
                    'error' => $exception->getMessage()
                ], 500);
            }
        }else{
            $this->validator($request->all())->validate();
            try {
                $insertedData = MedicineIn::create($request->all());
                return response()->json($insertedData);
            } catch (\Exception $exception) {
                return response()->json([
                    'error' => $exception->getMessage()
                ], 500);
            }
        }

    }

    public function update(Request $request)
    {
        $this->validator($request->all())->validate();
        try {
            $data = MedicineIn::findOrfail($request->get("id"));
            $data->name=$request->get("name");
            $data->company_name=$request->get("company_name");
            $data->generic_name=$request->get("generic_name");
            $data->measurement_value=$request->get("measurement_value");
            $data->measurement_unit_id=$request->get("measurement_unit_id");
            $data->medicine_type_id=$request->get("medicine_type_id");
            $data->save();
            return response()->json($request->all());
        } catch (\Exception $exception) {
            return response()->json([
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    public function delete($id)
    {
        try {
            $delete=MedicineIn::findOrfail($id)->delete();
            return response()->json($delete);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    public function listMedicineIn($pageSize)
    {
        try {
            $data = MedicineIn::select(
                'medicines.name',
                'medicines.company_name',
                'medicine_types.title as mttitle' ,
                'medicine_stock_in.id'
                ,'medicine_stock_in.created_at'
                ,'medicine_stock_in.medicine_main_packing_id as mpacking',
                'medicine_stock_in.quantity as mquantity',
                'medicine_stock_in.medicine_price_in as mprice',
                'medicine_stock_in.medicine_price_out as mpriceout'
                , 'medicine_stock_in.medicine_main_packing_id'
                ,'medicine_expire_date',
                'packing_units.title as putitle',
                'packing_units.id as packing_unit_id',
                'medicine_stock_in_id',
                'medicine_small_packing.medicine_packing_unit_id as spacking',
                'medicine_small_packing.medicine_price_out as smpriceout'
                ,'medicine_small_packing.quantity as squantity')
                ->leftJoin("medicine_small_packing",'medicine_small_packing.medicine_stock_in_id','=','medicine_stock_in.id')
                ->join("packing_units",'packing_units.id','=','medicine_stock_in.medicine_main_packing_id')
                ->join("medicines",'medicines.id','=','medicine_stock_in.medicine_id')
                ->join("medicine_types",'medicine_types.id','=','medicines.medicine_type_id')
                ->latest('created_at')->paginate($pageSize);
            return response()->json($data);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => $exception
            ], 500);
        }
    }

    protected function validator(array $data)
    {
        return Validator::make($data, [
            'medicine_id' => ['required', 'numeric'],
            'medicine_main_packing_id' => ['required', 'numeric'],
            'quantity' => ['required', 'numeric','min:1', 'max:100000'],
            'medicine_price_in' => ['required', 'numeric', 'min:0', 'max:1000000'],
            'medicine_price_out' => ['required', 'numeric', 'min:0', 'max:1000000'],
            'medicine_expire_date' => ['required','date'],
            'user_id' => ['required', 'numeric'],
        ]);
    }


    protected function smallValidator(array $data)
    {
        return Validator::make($data, [
            'medicine_id' => ['required', 'numeric'],
            'medicine_main_packing_id' => ['required', 'numeric'],
            'quantity' => ['required', 'numeric','min:1', 'max:100000'],
            'medicine_price_in' => ['required', 'numeric', 'min:0', 'max:1000000'],
            'medicine_price_out' => ['required', 'numeric', 'min:0', 'max:1000000'],
            'medicine_expire_date' => ['required','date'],
            'user_id' => ['required', 'numeric'],
            'sm_medicine_small_packing_id' => ['required', 'numeric'],
            'sm_quantity' => ['required', 'numeric','min:1', 'max:100000'],
            'sm_medicine_price_out' => ['required', 'numeric', 'min:0', 'max:1000000'],

        ]);
    }

}
