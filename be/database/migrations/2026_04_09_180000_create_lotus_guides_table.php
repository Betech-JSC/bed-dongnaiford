<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('lotus_guides')) {
            Schema::create('lotus_guides', function (Blueprint $table) {
                $table->id();
                $table->string('title');
                $table->string('slug')->unique();
                $table->string('icon')->nullable();
                $table->text('summary')->nullable();
                $table->longText('content')->nullable();
                $table->string('video_url')->nullable();
                $table->string('category')->nullable();
                $table->string('status')->default('ACTIVE');
                $table->integer('sort_order')->default(0);
                $table->integer('created_by')->nullable();
                $table->integer('updated_by')->nullable();
                $table->timestamps();
                $table->softDeletes();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('lotus_guides');
    }
};
