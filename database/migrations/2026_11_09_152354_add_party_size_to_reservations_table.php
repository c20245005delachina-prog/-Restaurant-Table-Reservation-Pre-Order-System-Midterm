<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('reservations', 'party_size')) {
            Schema::table('reservations', function (Blueprint $table) {
                $table->unsignedInteger('party_size')->default(1);
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('reservations', 'party_size')) {
            Schema::table('reservations', function (Blueprint $table) {
                $table->dropColumn('party_size');
            });
        }
    }
};
