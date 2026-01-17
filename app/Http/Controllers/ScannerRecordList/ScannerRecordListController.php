<?php

namespace App\Http\Controllers\ScannerRecordList;

use App\Http\Controllers\Controller;
use App\Http\Requests\ScannerRecordList\ScannerRecordListRequest;
use App\Models\BranchList;
use App\Models\ScannerRecordList;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ScannerRecordListController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $scannerRecordLists = ScannerRecordList::with('branchList')->get();

        $branchLists = BranchList::all();

        $selectableBranchLists = BranchList::query()
            ->doesntHave('scannerRecordLists')
            ->get();

        return Inertia::render('scanner-record-list/index', [
            'scannerRecordLists'    => $scannerRecordLists,
            'branchLists'           => $branchLists,
            'selectableBranchLists' => $selectableBranchLists
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('scanner-record-list/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        ScannerRecordList::create([
            $request->field => $request->value
        ]);

        return to_route('scanner-record-lists.index')->with('success', 'Scanner record created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $ScannerRecordList = ScannerRecordList::findOrFail($id);

        return Inertia::render('scanner-record-list/edit', [
            'ScannerRecordList' => $ScannerRecordList,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ScannerRecordList $scannerRecordList)
    {
        $scannerRecordList->update($request->all());

        return to_route('scanner-record-lists.index')->with('success', 'Scanner record updated successfully');
    }

    public function delete(ScannerRecordList $scannerRecordList)
    {
        return Inertia::render('scanner-record-list/delete', [
            'scannerRecordList' => $scannerRecordList,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ScannerRecordList $scannerRecordList)
    {
        $scannerRecordList->delete();

        return to_route('scanner-record-lists.index')->with('success', 'Scanner record deleted successfully');
    }
}
