<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Cho phép bỏ trống tab en/zh trong form Chính Sách.
 * title NOT NULL → nullable để admin chỉ cần điền tab vi.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('policy_translations', function (Blueprint $table) {
            $table->string('title')->nullable()->change();
            $table->longText('content')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('policy_translations', function (Blueprint $table) {
            $table->string('title')->nullable(false)->change();
            $table->longText('content')->nullable(false)->change();
        });
    }
};
