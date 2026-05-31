<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('lotus_products', 'highlights')) {
            Schema::table('lotus_products', function (Blueprint $table) {
                $table->json('highlights')->nullable()->after('sections')
                    ->comment('Danh sách bullet points nổi bật hiển thị trên card');
            });
        }
    }

    public function down(): void
    {
        Schema::table('lotus_products', function (Blueprint $table) {
            $table->dropColumn('highlights');
        });
    }
};
