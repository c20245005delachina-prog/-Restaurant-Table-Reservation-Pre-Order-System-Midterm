
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Rename the old column if contact_number does not exist.
        if (
            Schema::hasColumn('customers', 'customer_number') &&
            !Schema::hasColumn('customers', 'contact_number')
        ) {
            Schema::table('customers', function (Blueprint $table) {
                $table->renameColumn('customer_number', 'contact_number');
            });
        }

        // If both columns exist, preserve the old values.
        elseif (
            Schema::hasColumn('customers', 'customer_number') &&
            Schema::hasColumn('customers', 'contact_number')
        ) {
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
    }

    public function down(): void
    {
        if (
            Schema::hasColumn('customers', 'contact_number') &&
            !Schema::hasColumn('customers', 'customer_number')
        ) {
            Schema::table('customers', function (Blueprint $table) {
                $table->renameColumn('contact_number', 'customer_number');
            });
        }
    }
};
