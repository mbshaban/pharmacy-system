<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

//Common data routes
Route::get('common-data-manager/common-data', 'HelperController@getCommonData');


Route::post('authentication/login', 'UserController@authenticate');

//Users

Route::post('users/register-user', 'UserController@registerUsers');
Route::get('users/list-users', 'UserController@listUsers');
Route::post('users/update-users', 'UserController@updateUsers');
Route::post('users/delete-users', 'UserController@deleteUsers');


// Medicines
Route::post('medicine/store-medicine', 'MedicineController@store');
Route::post('medicine/update-medicine', 'MedicineController@update');
Route::get('medicine/list-medicines/{pageSize}', 'MedicineController@listMedicine');
Route::get('medicine/delete-medicine/{id}', 'MedicineController@delete');

// Medicines
Route::post('medicine-in/store-medicine-in', 'MedicineInController@store');
Route::post('medicine-in/update-medicine', 'MedicineInController@update');
Route::get('medicine-in/list-medicine-stock-in/{pageSize}', 'MedicineInController@listMedicineIn');
Route::get('medicine-in/delete-medicine-in/{id}', 'MedicineInController@delete');

Route::post('medicine-out/store-medicine-out', 'MedicineOutController@store');
Route::post('medicine-out/update-medicine-out', 'MedicineOutController@update');
Route::get('medicine-out/list-medicine-stock-out/{patientId}/{billNumber}', 'MedicineOutController@listMedicineOut');
Route::get('medicine-out/delete-medicine-out/{id}', 'MedicineOutController@delete');
Route::post('medicine-out/store-patient-name', 'MedicineOutController@storePatientName');
Route::post('medicine-out/store-patient-payment', 'MedicineOutController@storePatientPayment');
Route::get('medicine-out/list-main-medicine-stock-out/{pageSize}', 'MedicineOutController@listMainMedicineOut');


