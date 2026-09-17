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
        Schema::table('contacts', function (Blueprint $table) {
            $table->timestamp('sent_at')->nullable()->after('type')->comment('Ngày khách gửi form từ client');
        });

        \Illuminate\Support\Facades\DB::table('contacts')
            ->whereNull('sent_at')
            ->update(['sent_at' => \Illuminate\Support\Facades\DB::raw('created_at')]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('contacts', function (Blueprint $table) {
            $table->dropColumn('sent_at');
        });
    }
};
