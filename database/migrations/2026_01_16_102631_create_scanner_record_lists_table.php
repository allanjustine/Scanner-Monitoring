<?php

use App\Models\BranchList;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('scanner_record_lists', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(BranchList::class)->nullable()->constrained()->cascadeOnDelete();
            $table->string('office_type')->nullable();
            $table->string('serial_number')->nullable();
            $table->string('model')->nullable();
            $table->string('status')->nullable();
            $table->string('remarks')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scanner_record_lists');
    }
};
