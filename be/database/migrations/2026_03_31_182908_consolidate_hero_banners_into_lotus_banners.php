<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Migrate data từ lotus_hero_banners → lotus_banners
     * rồi drop bảng lotus_hero_banners.
     *
     * HeroBanner fields: id, title, image (json), location (string), status, created_at, updated_at, deleted_at
     * LotusBanner fields: title, subtitle, image, image_mobile, location (json array), button_text, button_link, sort_order, status
     *
     * Mapping:
     *   title      → title
     *   image      → image
     *   location   → location (convert string → JSON array ["homepage_hero"])
     *   status     → status
     *   subtitle, image_mobile, button_text, button_link, sort_order → NULL / 0
     */
    public function up(): void
    {
        if (!Schema::hasTable('lotus_hero_banners')) {
            return;
        }

        $heroBanners = DB::table('lotus_hero_banners')
            ->whereNull('deleted_at')
            ->get();

        foreach ($heroBanners as $hero) {
            // Nếu location là string đơn như "homepage" → chuyển thành JSON array
            $locationRaw = $hero->location;
            if (!empty($locationRaw)) {
                $decoded = json_decode($locationRaw, true);
                // Nếu chưa phải JSON array hợp lệ thì wrap vào array
                if (!is_array($decoded)) {
                    $locationJson = json_encode([$locationRaw]);
                } else {
                    $locationJson = $locationRaw; // đã là JSON array
                }
            } else {
                // Không có location → mặc định homepage_hero
                $locationJson = json_encode(['homepage_hero']);
            }

            DB::table('lotus_banners')->insert([
                'title'       => $hero->title,
                'subtitle'    => null,
                'image'       => $hero->image, // đã là JSON string
                'image_mobile'=> null,
                'location'    => $locationJson,
                'button_text' => null,
                'button_link' => null,
                'sort_order'  => 0,
                'status'      => $hero->status,
                'created_at'  => $hero->created_at,
                'updated_at'  => $hero->updated_at,
                'deleted_at'  => null,
            ]);
        }

        Schema::dropIfExists('lotus_hero_banners');
    }

    public function down(): void
    {
        // Recreate lotus_hero_banners (rollback bảng trống, không restore data)
        Schema::create('lotus_hero_banners', function (Blueprint $table) {
            $table->id();
            $table->string('title', 255)->nullable();
            $table->string('image', 500)->nullable();
            $table->string('location', 100)->nullable()->comment('Vị trí hiển thị: homepage, product, about...');
            $table->enum('status', ['ACTIVE', 'INACTIVE'])->default('ACTIVE');
            $table->timestamps();
            $table->softDeletes();
        });
    }
};
