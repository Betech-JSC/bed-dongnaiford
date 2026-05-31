<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use JamstackVietnam\Tag\Models\Tag;

class CreatePostTagsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('post_tags', function (Blueprint $table) {
            $table->id();

            $table->string('color')->nullable();
            $table->text('icon')->nullable();
            $table->integer('position')->nullable();

            $table->string('status', 30)->default(Tag::STATUS_ACTIVE);
            $table->integer('view_count')->default(0);
            $table->addInjectCode();
            $table->addTimestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('post_tags');
    }
}
