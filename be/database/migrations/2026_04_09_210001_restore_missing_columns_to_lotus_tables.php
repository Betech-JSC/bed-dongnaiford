<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ── lotus_teams ──────────────────────────────────────────────
        Schema::table('lotus_teams', function (Blueprint $table) {
            if (!Schema::hasColumn('lotus_teams', 'name')) {
                $table->string('name')->nullable()->after('id');
            }
            if (!Schema::hasColumn('lotus_teams', 'slug')) {
                $table->string('slug')->nullable()->after('name');
            }
            if (!Schema::hasColumn('lotus_teams', 'job_title')) {
                $table->string('job_title')->nullable()->after('slug');
            }
            if (!Schema::hasColumn('lotus_teams', 'department')) {
                $table->string('department')->nullable()->after('job_title');
            }
            if (!Schema::hasColumn('lotus_teams', 'short_bio')) {
                $table->text('short_bio')->nullable()->after('department');
            }
        });

        // ── lotus_sponsors ───────────────────────────────────────────
        Schema::table('lotus_sponsors', function (Blueprint $table) {
            if (!Schema::hasColumn('lotus_sponsors', 'name')) {
                $table->string('name')->nullable()->after('id');
            }
        });

        // ── lotus_reviews ────────────────────────────────────────────
        Schema::table('lotus_reviews', function (Blueprint $table) {
            if (!Schema::hasColumn('lotus_reviews', 'customer_name')) {
                $table->string('customer_name')->nullable()->after('product_id');
            }
            if (!Schema::hasColumn('lotus_reviews', 'content')) {
                $table->text('content')->nullable()->after('customer_name');
            }
        });
    }

    public function down(): void
    {
        Schema::table('lotus_teams', function (Blueprint $table) {
            $cols = ['name', 'slug', 'job_title', 'department', 'short_bio'];
            foreach ($cols as $col) {
                if (Schema::hasColumn('lotus_teams', $col)) {
                    $table->dropColumn($col);
                }
            }
        });

        Schema::table('lotus_sponsors', function (Blueprint $table) {
            if (Schema::hasColumn('lotus_sponsors', 'name')) {
                $table->dropColumn('name');
            }
        });

        Schema::table('lotus_reviews', function (Blueprint $table) {
            foreach (['customer_name', 'content'] as $col) {
                if (Schema::hasColumn('lotus_reviews', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
    }
};
