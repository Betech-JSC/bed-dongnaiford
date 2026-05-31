<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lotus_review_translations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('lotus_review_id');
            $table->string('locale', 10)->index();
            $table->string('customer_name', 100)->nullable();
            $table->text('content')->nullable();
            $table->enum('status_locale', ['ACTIVE', 'INACTIVE'])->default('ACTIVE');
            $table->timestamps();

            $table->unique(['lotus_review_id', 'locale']);
            $table->foreign('lotus_review_id')
                  ->references('id')
                  ->on('lotus_reviews')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lotus_review_translations');
    }
};
