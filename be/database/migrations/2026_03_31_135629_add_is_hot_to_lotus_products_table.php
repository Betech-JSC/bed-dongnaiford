<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (!Schema::hasColumn('lotus_products', 'is_hot')) {
            Schema::table('lotus_products', function (Blueprint $table) {
                $table->boolean('is_hot')->default(false)->comment('Sản phẩm nổi bật')->after('sort_order');
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('lotus_products', function (Blueprint $table) {
            $table->dropColumn('is_hot');
        });
    }
};
