<?php

namespace App\Http\Controllers;

use App\User;
use App\UserModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use PHPUnit\Exception;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class UserController extends Controller
{
    //
    public function registerUsers(Request $request)
    {
        $this->validator($request->all())->validate();
        $data = UserModel::select('email')
            ->where('email', $request->get('email'))
            ->first();
        if ($data) {
            return response()->json(['error' => 'already exist'], 302);
        }
        try {
            $insertedData = $this->addUsers($request->all());
            return response()->json([
                'id' => $insertedData['id']
            ]);

        } catch (\Exception $exception) {
            return response()->json([
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    public function listUsers()
    {
        try {
            $data = UserModel::select('full_name', 'email', 'phone', 'user_status_id', 'privilege_id',
                'privileges.title', 'user_status.status', 'users.id', 'password')
                ->join('privileges', 'users.privilege_id', '=', 'privileges.id')
                ->join('user_status', 'users.user_status_id', '=', 'user_status.id')
                ->get();
            return response()->json($data);
        } catch (\Exception $exception) {

        }
    }

    public function updateUsers(Request $request)
    {
        $this->updateValidator($request->all())->validate();
        try {
            $this->editUsers($request->all());
            return response()->json([
                'full_name' => $request->get('full_name'),
                'phone' => $request->get('phone'),
                'email' => $request->get('email'),
                'role_id' => $request->get('role_id')
            ]);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => $exception->getMessage()
            ]);
        }
    }

    public function deleteUsers(Request $request)
    {
        try {
            UserModel::where('id', $request->get('id'))->delete();
            return response()->json([
                'id' => $request->get('id')
            ]);
        } catch (\Exception $exception) {
            return response()->json([
                'error' => $exception->getMessage()
            ]);
        }
    }

    private function addUsers(array $data)
    {
        return UserModel::create([
            'full_name' => $data['full_name'],
            'password' => Hash::make($data['password']),
            'email' => $data['email'],
            'phone' => $data['phone'],
            'role_id' => $data['role_id']
        ]);
    }

    private function validator(array $data)
    {
        return Validator::make($data, [
            'full_name' => ['required', 'string', 'min:3'],
            'password' => ['required', 'min:3'],
            'email' => ['required', 'min:3'],
            'phone' => ['required', 'string'],
        ]);
    }

    private function updateValidator(array $data)
    {
        return Validator::make($data, [
            'full_name' => ['required', 'string', 'min:3'],
            'email' => ['required', 'min:3'],
            'phone' => ['required', 'string'],
        ]);
    }

    private function editUsers(array $data)
    {
        $users = UserModel::find($data['user_id']);
        $users->full_name = $data['full_name'];
        $users->phone = $data['phone'];
        $users->email = $data['email'];
        $users->role_id = $data['role_id'];
        return $users->save();
    }


    public function authenticate(Request $request)
    {
        $credentials = $request->only('email', 'password');
        try {
            $data = UserModel::select('users.id as user_id',  'email', 'full_name', 'roles.title as role_slug')
                ->join('roles', 'roles.id', '=', 'users.role_id')
                ->where('email', $request->get('email'))
                ->first();
            if ($data) {
                if ($data->status !== "suspended") {
                    if (!$token = JWTAuth::claims([
                        'role_slug' => $data->role_slug,
                        'name' => $data->full_name,
                        'user_id' => $data->user_id,
                        'email' => $data->email
                    ])->attempt($credentials)) {
                        return response()->json(['error' => 'invalid_credentials'], 400);
                    }
                    return $this->respondWithToken($token);
                } else {
                    return response()->json(['error' => 'suspended'], 404);
                }
            } else {
                return response()->json(['error' => 'Not Found'], 400);
            }
        } catch (JWTException $e) {
            return response()->json(['error' => 'could_not_create_token'], 500);
        }
    }

    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => JWTAuth::factory()->getTTL() * 180
        ]);
    }

    public function getAuthenticatedUser()
    {
        try {

            if (!$user = JWTAuth::parseToken()->authenticate()) {
                return response()->json(['user_not_found'], 404);
            }

        } catch (Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {

            return response()->json(['token_expired'], $e->getStatusCode());

        } catch (Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {

            return response()->json(['token_invalid'], $e->getStatusCode());

        } catch (Tymon\JWTAuth\Exceptions\JWTException $e) {

            return response()->json(['token_absent'], $e->getStatusCode());

        }

        return response()->json(compact('user'));
    }


}
