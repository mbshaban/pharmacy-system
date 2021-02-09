<?php

namespace App\Http\Controllers;

use App\Medicine;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MedicineController extends Controller
{
    //
    public function store(Request $request)
    {
        $this->validator($request->all())->validate();
        try {
            $insertedData = Medicine::create($request->all());
            return response()->json($insertedData);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    public function update(Request $request)
    {
        $this->validator($request->all())->validate();
        try {
            $data = Medicine::findOrfail($request->get("id"));
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
            $delete=Medicine::findOrfail($id)->delete();
            return response()->json($delete);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    public function listMedicine($pageSize)
    {
        try {
            $data = Medicine::select('medicines.id','medicines.created_at', 'name', 'company_name','generic_name',
                'measurement_value','measurement_unit_id','medicine_type_id' ,'medicine_types.title as mtTitle','medicine_measurement_unit.title as mmuTitle')
                ->join("medicine_measurement_unit",'medicine_measurement_unit.id','=','medicines.measurement_unit_id')
                ->join("medicine_types",'medicine_types.id','=','medicines.medicine_type_id')
                ->latest('created_at')->paginate($pageSize);
            return response()->json($data);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    protected function validator(array $data)
    {
        return Validator::make($data, [
            'name' => ['required', 'string', 'min:3', 'max:255'],
            'company_name' => ['required', 'string', 'min:3', 'max:255'],
            'generic_name' => ['required', 'string', 'min:3', 'max:255'],
            'measurement_value' => ['required', 'numeric', 'min:0', 'max:100000'],
            'measurement_unit_id' => ['required', 'numeric'],
            'medicine_type_id' => ['required', 'numeric'],
        ]);
    }
}
