<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Preserve existing customer phone numbers.
        DB::table('customers')
            ->whereNull('contact_number')
            ->update([
                'contact_number' => DB::raw('customer_number'),
            ]);

        Schema::table('customers', function (Blueprint $table) {
            $table->dropIndex(['customer_number']);
            $table->dropColumn('customer_number');
        });
    }

    public function down(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            $table->string('customer_number', 30)->nullable()->index();
        });

        DB::table('customers')->update([
            'customer_number' => DB::raw('contact_number'),
        ]);
    }
};
