<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Training;
use App\Models\TrainingDays;
use App\Models\TrainingParticipants;
use App\Models\TrainingSeasons;
use App\Models\User;
use App\Models\Crew;
use Validator;
use PDF;

class TrainingController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login']]);
    }

    public function trainingIndex() {
        $trainings = Training::all();

        return response()->json($trainings, 200);
    }

    public function trainingIndexToday() {
        $today = date("Y-m-d");

        $result = TrainingDays::select('trainings.code','trainings.description','trainingDays.*')->join('trainings','trainingDays.trainingID','=','trainings.id')->where('date', '=', $today)->get();

        foreach($result as $key => $day) {
            $status = $this->checkIfParticipated($day['id'], $this->getMyCrewID(), false);
            $result[$key]['status'] = $status;
        }
        return response()->json($result, 200);
    }

    public function createTraining(Request $request) {
        $input = $request->all();

        $validator = Validator::make($input, [
            'code' => 'required',
            'description' => 'required',
            'validity' => 'required'
        ]);

        if($validator->fails()) {
            return response()->json("Validation error: " . $validator->errors(), 400);
        }

        $created = Training::create($input);

        return response()->json("Training created" . $created, 200);
    }

    public function updateTraining(Request $request, $id) {
        $input = $request->all();

        $validator = Validator::make($input, [
            'code' => 'required',
            'description' => 'required',
            'validity' => 'required'
        ]);

        if($validator->fails()) {
            return response()->json("Validation error: " . $validator->errors(), 400);
        }

        $training = Training::find($id);

        $training->code = $input['code'];
        $training->description = $input['description'];
        $training->contents = $input['contents'];
        $training->validity = $input['validity'];
        $training->save();

        return response()->json("Training updated", 200);
    }

    public function deleteTraining($id) {
        $training = Training::destroy($id);
        return response()->json("Training deleted", 200);
    }

    public function createSeason(Request $request) {
        $input = $request->all();

        $validator = Validator::make($input, [
            'seasonName' => 'required',
            'seasonStartDate' => 'required',
            'seasonEndDate' => 'required'
        ]);

        if($validator->fails()) {
            return response()->json("Validation error: " . $validator->errors(), 400);
        }

        $created = TrainingSeasons::create($input);

        return response()->json("Training season created" . $created, 200);
    }

    public function updateSeason(Request $request, $id) {
        $input = $request->all();

        $validator = Validator::make($input, [
            'seasonName' => 'required',
            'seasonStartDate' => 'required',
            'seasonEndDate' => 'required'
        ]);

        if($validator->fails()) {
            return response()->json("Validation error: " . $validator->errors(), 400);
        }

        $season = TrainingSeasons::find($id);

        $season->seasonName = $input['seasonName'];
        $season->seasonStartDate = $input['seasonStartDate'];
        $season->seasonEndDate = $input['seasonEndDate'];
        $season->save();

        return response()->json("Training season updated", 200);
    }

    public function deleteSeason($id) {
        $season = TrainingSeasons::destroy($id);
        return response()->json("Season deleted", 200);
    }

    public function seasonsIndex() {
        $seasons = TrainingSeasons::all();

        return response()->json($seasons, 200);
    }

    public function getSeason($id) {
        $season = TrainingSeasons::find($id);

        return response()->json($season, 200);
    }


    public function createDay(Request $request) {
        $input = $request->all();

        $validator = Validator::make($input, [
            'trainingID' => 'required',
            'seasonID' => 'required',
            'date' => 'required',
            'timeStarts' => 'required',
            'timeEnds' => 'required',
            'trainer' => 'required'
        ]);

        if($validator->fails()) {
            return response()->json("Validation error: " . $validator->errors(), 400);
        }

        $created = TrainingDays::create($input);

        return response()->json("Training day created" . $created, 200);
    }

    public function updateDay(Request $request, $id) {
        $input = $request->all();

        $validator = Validator::make($input, [
            'trainingID' => 'required',
            'seasonID' => 'required',
            'date' => 'required',
            'timeStarts' => 'required',
            'timeEnds' => 'required',
            'trainer' => 'required'
        ]);

        if($validator->fails()) {
            return response()->json("Validation error: " . $validator->errors(), 400);
        }

        $day = TrainingDays::find($id);

        $day->trainingID = $input['trainingID'];
        $day->seasonID = $input['seasonID'];
        $day->date = $input['date'];
        $day->timeStarts = $input['timeStarts'];
        $day->timeEnds = $input['timeEnds'];
        $day->trainer = $input['trainer'];
        $day->save();

        return response()->json("Training day updated", 200);
    }

    public function deleteDay($id) {
        $day = TrainingDays::destroy($id);
        $participants = TrainingParticipants::where('dayID','=',$id)->delete();
        return response()->json("Training day deleted", 200);
    }

    public function daysIndex() {
        $days = TrainingDays::with('trainings')->get();

        return response()->json($days, 200);
    }

    public function getDay($id) {
        $day = TrainingDays::with('trainings')->find($id);

        return response()->json($day, 200);
    }

    public function getDaysBySeason($season) {
        $days = TrainingDays::with('trainings')->where('seasonID', '=', $season)->get();

        return response()->json($days, 200);
    }

    public function getDaysByTraining($training) {
        $days = TrainingDays::where('trainingID', '=', $training)->get();

        return response()->json($days, 200);
    }

    public function getDaysByTrainingInSeason($training, $season) {
        $days = TrainingDays::with('trainings')->where('trainingID', '=', $training)->where('seasonID', '=', $season)->get();

        return response()->json($days, 200);
    }

    public function getParticipantsByTraining($training) {
        $list = TrainingParticipants::with('getCrewDetails', 'getUserDetails')->where('dayID', '=', $training)->get();

        if(!$list->count()) {
            return response()->json("No results.", 200);
        }
        return response()->json($list, 200);
    }

    public function addParticipant(Request $request) {
        $input = $request->all();

        $validator = Validator::make($input, [
            'dayID' => 'required',
            'crewID' => 'required'
        ]);

        if($validator->fails()) {
            return response()->json("Validation error: " . $validator->errors(), 400);
        }

        $created = TrainingParticipants::create($input);

        return response()->json("Participant Added to training" . $created, 200);
    }

    public function deleteParticipant($id) {
        $participant = TrainingParticipants::destroy($id);
        return response()->json("Participant deleted", 200);
    }

    private function getMyCrewID() {
        $myId = auth()->user()->id;
        $myId = Crew::where('userID', '=', $myId)->get('id');
        $myId = $myId[0]->id;

        return $myId;
    }

    public function myTrainings($season, $pdfReport = false) {

        $days = TrainingDays::where('seasonID', '=', $season)->pluck('id');
        $myId = $this->getMyCrewID();

        $trainings = [];
        foreach($days as $day) {
            $training = TrainingParticipants::select('trainingDays.*', 'trainings.id as trainingID', 'trainings.code as trainingCode')->join('trainingDays', 'trainingDays.id', '=', 'trainingParticipants.dayID')->join('trainings', 'trainings.id','=','trainingDays.trainingID')->where('crewID', '=', $myId)->where('dayID', '=', $day)->get();
            if(count($training) != 0) {
                array_push($trainings, $training);
            }
        }

        if(!$pdfReport) {
            return response()->json($trainings, 200);
        } else {
            return $trainings;
        }
    }

    public function mySeasons() {
        $myId = $this->getMyCrewID();
        $seasons = TrainingDays::join('trainingParticipants', 'trainingParticipants.dayID', '=', 'trainingDays.id')->where('trainingParticipants.crewID', '=', $myId)->groupBy('trainingDays.seasonID')->pluck('trainingDays.seasonID');

        $result = [];
        foreach($seasons as $id) {
            $season = TrainingSeasons::where('id', '=', $id)->get();
            if(count($season) != 0) {
                array_push($result, $season);
            }
        }

        return response()->json($result, 200);
    }

    public function checkIfParticipated($dayID, $crewID, $api=true) {
        if(TrainingParticipants::where('dayID', '=', $dayID)->where('crewID', '=', $crewID)->exists()) {
            if($api) {
                return response()->json("Exists", 200);
            } else {
                return true;
            }
        }

        if($api) {
            return response()->json("No", 200);
        } else {
            return false;
        }
    }

    public function participateTraining(Request $request) {
        $input = $request->all();
        $input['crewID'] = $this->getMyCrewID();

        $validator = Validator::make($input, [
            'dayID' => 'required',
            'crewID' => 'required'
        ]);

        if($validator->fails()) {
            return response()->json("Validation error: " . $validator->errors(), 400);
        }

        // if(TrainingParticipants::where('dayID', '=', $input['dayID'], 'AND', 'crewID', '=', $input['crewID'])->exists()) {
        if($this->checkIfParticipated($input['dayID'], $input['crewID'], false)) {
            return response()->json(["message" => "Already exists."], 422);
        }

        $created = TrainingParticipants::create($input);

        return response()->json("Participated in training" . $created, 200);
    }

    public function createPDF($seasonID) {
        $myUserId = auth()->user()->id;
        $crewInfo = Crew::where('userID', '=', $myUserId)->get();
        $userInfo = User::where('id','=',$myUserId)->get();
        $myTrainings = $this->myTrainings($seasonID, true);
        $seasonName = TrainingSeasons::where('id', '=', $seasonID)->get('seasonName');
        $seasonName = $seasonName[0]->seasonName;

        $data = [
            'title' => 'Arkia Airlines',
            'date' => date('m/d/Y'),
            'seasonName' => $seasonName,
            'empID' => $crewInfo[0]->empID,
            'civilID' => $crewInfo[0]->civilID,
            'fullNameEN' => $crewInfo[0]->firstNameEN . " " . $crewInfo[0]->lastNameEN,
            'trainings' => $myTrainings
        ];
        // //$pdf = App::make('dompdf.wrapper');

        // $pdf = PDF::loadView('reTrainingPDF', $data);

        // //$pdf = PDF::loadHTML('<h1>Anton Bonin</h1>');


        // return $pdf->stream();

        //$users = User::orderBy('id','asc')->get();
        // usersPdf is the view that includes the downloading content
        $view = \View::make('reTrainingPDF', $data);
        $html_content = $view->render();
        // Set title in the PDF
        PDF::SetTitle("Arkia Israeli Airlines | Training Department");
        PDF::setFontSubsetting(true);
        PDF::SetFont('dejavusans', '', 12);
        PDF::AddPage();
        PDF::writeHTML($html_content, true, false, true, false, '');
        // userlist is the name of the PDF downloading
        PDF::Output('userlist.pdf');
      }
}
