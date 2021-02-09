<?php

namespace App\Http\Controllers;

use App\GeneralStockOutNumber;
use App\MedicineIn;
use App\MedicineInSmallPacking;
use App\MedicineOut;
use App\Patient;
use App\PatientPayment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class MedicineOutController extends Controller
{
    //
    public function store(Request $request)
    {
        $this->validator($request->all())->validate();
        try {
            $insertedData = MedicineOut::create($request->all());
            return response()->json($insertedData);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    public function storePatientName(Request $request)
    {
        $this->validateName($request->all())->validate();
        try {
            $data = null;
            DB::beginTransaction();
            $billNumber = GeneralStockOutNumber::create();
            if ($request->get("patient_id") != null) {
                $data = Patient::findOrFail($request->get("patient_id"));
                $data->full_name = $request->get("full_name");
                $data->save();
            } else {

                $data = Patient::create($request->all());
            }
            DB::commit();
            return response()->json(["data" => $data, "billNumber" => $billNumber->id]);
        } catch (\Exception $exception) {
            DB::rollBack();
            return response()->json([
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    public function storePatientPayment(Request $request)
    {
        $this->validatePayment($request->all())->validate();
        try {
            $data = PatientPayment::create($request->all());
            return response()->json($data);
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
            $data = MedicineOut::findOrfail($request->get("id"));
            $data->medicine_id = $request->get("medicine_id");
            $data->quantity = $request->get("quantity");
            $data->medicine_main_packing_id = $request->get("medicine_main_packing_id");
            $data->user_id = $request->get("user_id");
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
            $delete = MedicineOut::findOrfail($id)->delete();
            return response()->json($delete);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    public function listMedicineOut($patientId, $billNumber)
    {
        try {
            $data = MedicineOut::select(
                'patients.full_name',
                'medicines.name',
                'medicines.company_name',
                'medicines.measurement_value',
                'medicine_types.title as medicine_type',
                'medicine_measurement_unit.title as measurement_unit',
                'medicine_stock_out.id',
                'medicine_stock_in.medicine_price_out'
                , 'medicine_stock_out.medicine_id'
                , 'medicine_stock_out.created_at'
                , 'medicine_stock_out.medicine_main_packing_id',
                'medicine_stock_out.quantity',
                'packing_units.title as title',
                'packing_units.id as packing_unit_id')
                ->join("packing_units", 'packing_units.id', '=', 'medicine_stock_out.medicine_main_packing_id')
                ->join("medicines", 'medicines.id', '=', 'medicine_stock_out.medicine_id')
                ->join("patients", 'patients.id', '=', 'medicine_stock_out.patient_id')
                ->join("medicine_types", 'medicine_types.id', '=', 'medicines.medicine_type_id')
                ->join("medicine_measurement_unit", 'medicine_measurement_unit.id', '=', 'medicines.measurement_unit_id')
                ->join("medicine_stock_in", 'medicine_stock_in.id', '=', 'medicine_stock_out.medicine_stock_in_id')
                ->where([
                    ['medicine_stock_out.patient_id', '=', $patientId],
                    ['medicine_stock_out.bill_number', '=', $billNumber],
                ])
                ->latest('created_at')->get();


            $total_payment = DB::raw("SELECT SUM(payed_price) as total_payment,bill_number from patient_payment where bill_number = " . $billNumber. " and patient_id = ".$patientId );

            return response()->json(['data' => $data, 'total_payment' => $total_payment]);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => $exception
            ], 500);
        }
    }

    public function listMainMedicineOut($pageSize)
    {
        try {

            $data = DB::select('SELECT 
                                        mso.id,
                                       IF(msi.small_price is null ,
                                       SUM(mso.quantity * msi.medicine_price_out),
                                       IF(msi.small_packing_id = mso.medicine_main_packing_id,
                                        SUM(mso.quantity * msi.small_price),
                                        SUM(mso.quantity * msi.medicine_price_out) )) as total,
                                    mso.quantity,mso.medicine_main_packing_id,mso.bill_number,mso.medicine_stock_in_id ,pp.total_payment
                                    , patients.full_name,patients.id as patient_id,mso.bill_number, msi.medicine_price_out, msi.small_price,msi.small_packing_id
                                    ,msi.medicine_main_packing_id ,mso.created_at FROM medicine_stock_out as
                                     mso JOIN (SELECT m.id,m.medicine_price_out,m.medicine_main_packing_id
                                     ,s.medicine_price_out as small_price,s.medicine_packing_unit_id as small_packing_id
                                      FROM medicine_stock_in as m left JOIN medicine_small_packing as s on m.id=s.medicine_stock_in_id) 
                                      as msi on msi.id=mso.medicine_stock_in_id left join (select SUM(payed_price) as total_payment,bill_number from patient_payment GROUP BY bill_number) as pp on pp.bill_number=mso.bill_number JOIN patients on patients.id=mso.patient_id 
                                      GROUP BY mso.bill_number');


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
            'quantity' => ['required', 'numeric', 'min:1', 'max:100000'],
            'user_id' => ['required', 'numeric'],
            'patient_id' => ['required', 'numeric'],
            'bill_number' => ['required', 'numeric'],
        ]);
    }

    protected function validateName(array $data)
    {
        return Validator::make($data, [
            'full_name' => ['required', 'string', 'min:3', 'max:256'],
        ]);
    }

    protected function validatePayment(array $data)
    {
        return Validator::make($data, [
            'payed_price' => ['required', 'numeric', 'min:0', 'max:1000000'],
            'patient_id' => ['required', 'numeric'],
        ]);
    }

}
