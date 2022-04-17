<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Crew;
use App\Models\userStatus;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login']]);
    }

    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login()
    {
        $input = request();
        $rememberMe = $input->rememberMe;

        $setTtl = $rememberMe ? 129600 : 1440;

        $credentials = request(['userName', 'password']);

        if (! $token = auth()->setTTL($setTtl)->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized: 401'], 401);
        }

        $response = $this->respondWithToken($token, auth()->user());

        if($response) {
            return $response;
        } else {
            return response()->json(['error' => 'User Info returned false: 401'], 401);
        }
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me()
    {
        return response()->json(auth()->user());
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        auth()->logout();

        return response()->json(['message' => 'Successfully logged out']);
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return $this->respondWithToken(auth()->refresh());
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token, $userID)
    {
        $userInfo = $this->getUserInfo($userID);
        if($userInfo){
            return response()->json([
                'access_token' => $token,
                'token_type' => 'bearer',
                'expires_in' => auth()->factory()->getTTL() * 60,
                'userInfo' => $userInfo
            ]);
        } else {
            return false;
        }
    }

    public function createUser(Request $request) {
        $user = User::create([
            'userName' => $request->input('userName'),
            'password' => Hash::make($request->input('password')),
            'email' => $request->input('email'),
            'firstName' => $request->input('firstName'),
            'lastName' => $request->input('lastName'),
            'userRole' => $request->input('userRole'),
            'trainingRole' => $request->input('trainingRole')
        ]);

        if($request->isCrewMember) {
            $crew = Crew::create([
                'userID' => $user->id,
                'empID' => $request->input('empID'),
                'civilID' => $request->input('civilID'),
                'phone' => $request->input('phone'),
                'city' => $request->input('city'),
                'firstNameEN' => $request->input('firstNameEN'),
                'lastNameEN' => $request->input('lastNameEN'),
                'seniority' => $request->input('seniority')
            ]);
        }
    }

    private function checkIfUserIsCrew($userID) {
        return $crew = Crew::where('userID', $userID)->firstOr(function() { return false; });
    }

    private function getUserInfo($user) {
        $user = User::find($user->id);

        $userStatus = userStatus::select('*')->where('userID', '=', $user->id)->orderBy('id', 'desc')->take(1)->get();

        if($userStatus[0]['status'] !== 'active') {
            return false;
        }

        $crew = $this->checkIfUserIsCrew($user->id);

        $userInfo = [$user];

        if($crew) {
            array_push($userInfo, $crew);
        }

        return $userInfo;
    }
}
