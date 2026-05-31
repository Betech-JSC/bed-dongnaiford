<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Tạo bảng lotus_team_translations
        if (!Schema::hasTable('lotus_team_translations')) {
            Schema::create('lotus_team_translations', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('lotus_team_id');
                $table->string('locale', 10)->index();
                $table->string('name')->nullable();
                $table->string('slug')->nullable()->index();
                $table->string('job_title')->nullable();
                $table->text('short_bio')->nullable();
                $table->longText('bio')->nullable();

                $table->unique(['lotus_team_id', 'locale']);
                $table->foreign('lotus_team_id')
                    ->references('id')->on('lotus_teams')
                    ->onDelete('cascade');
            });
        }

        // 2. Migrate data hiện có sang translations (locale = 'vi')
        $teams = DB::table('lotus_teams')->get();
        foreach ($teams as $team) {
            $exists = DB::table('lotus_team_translations')
                ->where('lotus_team_id', $team->id)
                ->where('locale', 'vi')
                ->exists();

            if (!$exists) {
                DB::table('lotus_team_translations')->insert([
                    'lotus_team_id' => $team->id,
                    'locale'        => 'vi',
                    'name'          => $team->name ?? '',
                    'slug'          => $team->slug ?? '',
                    'job_title'     => $team->job_title ?? null,
                    'short_bio'     => $team->short_bio ?? null,
                    'bio'           => null,
                ]);
            }
        }

        // 3. Xoá các cột đã chuyển sang translations
        Schema::table('lotus_teams', function (Blueprint $table) {
            $table->dropColumn(['name', 'slug', 'job_title', 'short_bio']);
        });
    }

    public function down(): void
    {
        Schema::table('lotus_teams', function (Blueprint $table) {
            $table->string('name')->nullable();
            $table->string('slug')->nullable();
            $table->string('job_title')->nullable();
            $table->text('short_bio')->nullable();
        });

        Schema::dropIfExists('lotus_team_translations');
    }
};
