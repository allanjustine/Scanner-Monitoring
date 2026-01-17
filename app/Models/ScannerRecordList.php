<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ScannerRecordList extends Model
{
    protected $guarded = [];

    public function branchList()
    {
        return $this->belongsTo(BranchList::class);
    }
}
