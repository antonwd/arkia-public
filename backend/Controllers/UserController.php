<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Crew;
use App\Models\crewStatus;
use App\Models\userStatus;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Validator;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login']]);
    }

    private function checkIfUserIsCrew($userID) {
        return $crew = Crew::where('userID', $userID)->firstOr(function() { return false; });
    }

    public function updateUser(Request $request, $id) {
        $input = $request->all();

        $user = User::find($id);
        $user->email = $input['user']['email'];
        $user->firstName = $input['user']['firstName'];
        $user->lastName = $input['user']['lastName'];
        $user->save();

        $crew = $this->checkIfUserIsCrew($id);
        if($crew) {
            $crew->firstNameEN = $input['crew']['firstNameEN'];
            $crew->lastNameEN = $input['crew']['lastNameEN'];
            $crew->civilID = $input['crew']['civilID'];
            $crew->phone = $input['crew']['phone'];
            $crew->city = $input['crew']['city'];
            $crew->save();
        }

        return response()->json("User Updated", 200);
    }

    private function matchPassword($currentPassword) {
        return Hash::check($currentPassword, auth()->user()->password);
    }

    public function changePassword(Request $request) {
        $input = $request->all();

        $validate = Validator::make($input, [
            'current_password' => 'required',
            'new_password' => 'required',
            'new_confirm_password' => 'same:new_password'
        ]);

        if($validate->fails()) {
            return response()->json(["message"=>"Validation Failed"], 422);
        }
        if(!$this->matchPassword($input['current_password'])){
            return response()->json(["message"=>"Current Password Incorrect"], 422);
        }
        if($input['current_password'] == $input['new_password']) {
            return response()->json(["message"=>"New Password Same as Current"], 422);
        }

        User::find(auth()->user()->id)->update(['password' => Hash::make($input['new_password'])]);
        return response()->json("Password changed", 200);
    }

    public function getPhoneList() {
        $result = User::select('users.id','users.firstName','users.lastName','crew.phone','crew.seniority')->join('crew','users.id','=','crew.userID')->get();

        $phoneList = [];

        foreach($result as $oneCrew) {
            if(!$this->checkIfUserIsCrew($oneCrew['id']) || !$this->checkUserActive($oneCrew['id']) || $oneCrew['id'] === 1) {
                continue;
            } else {
                array_push($phoneList, $oneCrew);
            }
        }

        return response()->json($phoneList, 200);
    }

    private function getCrewStatus($crewID) {
        $result = crewStatus::select('crewID','statusID','statusUpdated','comment','crewStatuses.statusValue')->join('crewStatuses', 'crewStatuses.id','=','crewStatus.statusID')->where('crewID', $crewID)->orderBy('crewStatus.id', 'desc')->take(1)->get();

        return $result;
    }

    private function checkUserActive($userID) {
        $result = userStatus::select('*')->where('userID', $userID)->orderBy('id', 'desc')->take(1)->get();

        if($result[0]['status'] !== 'active') {
            return false;
        } else {
            return true;
        }
    }

    public function getUsersList() {
        $result = User::select('users.*','crew.*')->join('crew','users.id','=','crew.userID')->get();
        $crewResult = [];
        foreach($result as $oneCrew) {
            if($this->checkUserActive($oneCrew['id'])) {
            $oneCrew['currentStatus'] = $this->getCrewStatus($oneCrew['id'])[0];
            array_push($crewResult, $oneCrew);
            } else {
                continue;
            }
        }

        return response()->json($crewResult, 200);
    }

    public function getInactiveUsersList() {
        $result = User::select('users.*','crew.*')->join('crew','users.id','=','crew.userID')->get();
        $crewResult = [];
        foreach($result as $oneCrew) {
            if($this->checkUserActive($oneCrew['id'])) {
                continue;
            } else {
                $oneCrew['currentStatus'] = $this->getCrewStatus($oneCrew['id'])[0];
                array_push($crewResult, $oneCrew);
            }
        }

        return response()->json($crewResult, 200);
    }

    public function getUsersNotCrew() {
        $result = User::select('users.*')->get();
        $crewResult = [];
        foreach($result as $oneCrew) {
            if($this->checkIfUserIsCrew($oneCrew['id'])) {
                continue;
            } else {
                $oneCrew['currentStatus'] = 'not_crew';
                array_push($crewResult, $oneCrew);
            }
        }
        return response()->json($crewResult, 200);
    }

    public function getUserData($userID) {
        $isCrew = $this->checkIfUserIsCrew($userID);

        $userData = false;

        if(!$isCrew) {
            $userData = User::select('users.*')->where('id', '=', $userID)->get();
        } else {
            $userData = User::select('users.*','crew.*')->join('crew','users.id','=','crew.userID')->where('users.id', '=', $userID)->get();
            $userData[0]['crewStatus'] = $this->getCrewStatus($isCrew->id)[0]['statusID'];
        }

        if($userData) return response()->json($userData[0], 200);
        if(!$userData) return response()->json("USER NOT FOUND", 404);
    }

    public function adminUpdateUserData(Request $request) {
        $input = $request->all();

        $userID = $input['userID'];
        $crewID = $input['crewID'];

        $user = User::find($userID);
        $user->email = $input['email'];
        $user->firstName = $input['firstName'];
        $user->lastName = $input['lastName'];
        $user->userRole = $input['userRole'];
        $user->trainingRole = $input['trainingRole'];
        $user->save();

        $crew = $this->checkIfUserIsCrew($userID);
        if($crew && $crew->userID === $userID) {
            $crew->firstNameEN = $input['firstNameEN'];
            $crew->lastNameEN = $input['lastNameEN'];
            $crew->civilID = $input['civilID'];
            $crew->empID = $input['empID'];
            $crew->phone = $input['phone'];
            $crew->city = $input['city'];
            $crew->seniority = $input['seniority'];
            $crew->save();


            $response = "Did not enter user status check";

            $inactiveNeeded = [3, 4, 7];

            $currentUserStatus = $this->checkUserActive($user->id);
            $currentStatus = $this->getCrewStatus($crewID)[0]['statusID'];
            if($currentStatus !== $input['crewStatus']) {
                $crewStatus = new CrewStatus;
                $crewStatus->crewID = $crewID;
                $crewStatus->statusID = $input['crewStatus'];
                $crewStatus->save();

                $response = "Entered crew status change, but not user status change";

                if(!$currentUserStatus && !in_array($input['crewStatus'], $inactiveNeeded)) {
                    $setUserStatus = new userStatus;
                    $setUserStatus->userID = $user->id;
                    $setUserStatus->status = 'active';
                    $setUserStatus->save();

                    $response = "Entered where user is inactive and changed to active";
                }
            }

            if($currentUserStatus && in_array($input['crewStatus'], $inactiveNeeded)){
                $setUserStatus = new userStatus;
                $setUserStatus->userID = $user->id;
                $setUserStatus->status = 0;
                $setUserStatus->save();

                $response = "Entered where user is active and changed to inactive";
            }
        }

        return response()->json("User Updated", 200);
        // return response()->json($response, 200);
    }
}

?>
