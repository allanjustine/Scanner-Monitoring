<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BranchList extends Model
{
    protected $guarded = [];

    public function scannerRecordLists()
    {
        return $this->hasMany(ScannerRecordList::class);
    }
}
