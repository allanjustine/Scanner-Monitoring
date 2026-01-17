<?php

use App\Http\Controllers\BranchList\BranchListController;
use App\Http\Controllers\ScannerRecordList\ScannerRecordListController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});
Route::redirect('/', '/scanner-record-lists');
Route::resource('/scanner-record-lists', ScannerRecordListController::class);
Route::get('todo-lists/{todo_list}/delete', [ScannerRecordListController::class, 'delete'])->name('delete');
Route::resource('branch-lists', BranchListController::class);


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
