<?php

namespace App\Http\Controllers\BranchList;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBranchListRequest;
use App\Models\BranchList;
use Illuminate\Http\Request;

class BranchListController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBranchListRequest $request)
    {
        $data = $request->validated();

        $branch = BranchList::create($data);

        return to_route('scanner-record-lists.index')->with('success', "Branch {$branch->branch_name} ($branch->branch_code) created successfully.");
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
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
