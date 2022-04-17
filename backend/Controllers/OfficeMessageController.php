<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Crew;
use App\Models\OfficeMessage;

class OfficeMessageController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login']]);
    }

    public function messagesIndex() {
        $today = date("Y-m-d");

        $myUserId = auth()->user()->id;
        $userInfo = User::where('id','=',$myUserId)->get();

        function checkVisibleTo($userRole, $trainingRole) {
            $visibleArray = ['all'];
            if($userRole === 'ca1' || $userRole === 'ca2') {
                array_push($visibleArray, 'purser');
            }
            if($userRole === 'ca') {
                array_push($visibleArray, 'ca3');
            }
            if($trainingRole === 'trainer') {
                array_push($visibleArray, 'trainer');
            }
            if($trainingRole === 'inspector') {
                array_push($visibleArray, 'inspector');
            }
            if($trainingRole === 'inspector' || $trainingRole === 'trainer') {
                array_push($visibleArray, 'training');
            }
            if($userRole === 'admin') {
                $visibleArray = ['all','purser','ca3','trainer','inspector','training'];
            }
            return $visibleArray;
        }

        $result = OfficeMessage::select('*')->where('expiryDate', '>', $today)->whereIn('visibleTo', checkVisibleTo($userInfo[0]->userRole, $userInfo[0]->trainingRole))->orderBy('id', 'DESC')->get();

        return response()->json($result, 200);
    }
}
