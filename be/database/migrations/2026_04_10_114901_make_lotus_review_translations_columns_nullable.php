<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('lotus_review_translations', function (Blueprint $table) {
            $table->string('customer_name', 255)->nullable()->change();
            $table->text('content')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('lotus_review_translations', function (Blueprint $table) {
            $table->string('customer_name', 255)->nullable(false)->change();
            $table->text('content')->nullable(false)->change();
        });
    }
};
