<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePostTagTranslationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('post_tag_translations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('post_tag_id');

            $table->string('title');
            $table->string('locale');
            $table->string('slug');

            $table->text('description')->nullable();

            $table->addSeo();

            $table->unique(['locale', 'post_tag_id']);
            $table->unique(['locale', 'slug']);
            $table->foreign('post_tag_id')
                ->references('id')
                ->on('post_tags')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('post_tag_translations');
    }
}
