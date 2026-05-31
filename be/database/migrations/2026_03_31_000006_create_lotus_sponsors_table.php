<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lotus_sponsors', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100)->nullable()->comment('Tên nhà tài trợ');
            $table->string('logo', 500)->nullable()->comment('Ảnh logo');
            $table->string('link', 500)->nullable()->comment('URL website nhà tài trợ');
            $table->integer('sort_order')->default(0);
            $table->enum('status', ['ACTIVE', 'INACTIVE'])->default('ACTIVE');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lotus_sponsors');
    }
};
