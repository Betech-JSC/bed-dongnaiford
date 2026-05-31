<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Copy vi-locale data from lotus_products main table into lotus_product_translations.
 *
 * Background:
 *   - Products were originally created with title/slug/author/sections in lotus_products directly.
 *   - After the Translatable refactoring (April 9), those fields moved to lotus_product_translations.
 *   - The previous "restore" migration (200000) copied FROM translations→main, but translations
 *     were empty at that point, so no data was seeded.
 *   - Result: lotus_products has valid vi data; lotus_product_translations is empty for those rows.
 *   - Astrotomic reads from translations → all translated fields return null via API.
 *
 * This migration seeds lotus_product_translations (locale='vi') with the existing main-table data.
 * It uses INSERT ... ON DUPLICATE KEY UPDATE to safely re-run on production.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('lotus_product_translations') || ! Schema::hasTable('lotus_products')) {
            return;
        }

        $columns = ['title', 'slug', 'overview', 'overview_courses', 'overview_future',
                    'author', 'author_title', 'author_description', 'sections', 'highlights', 'sections_title'];

        // Fetch all products that have at least a title in the main table
        $products = DB::table('lotus_products')
            ->whereNotNull('title')
            ->whereNull('deleted_at')
            ->get();

        foreach ($products as $product) {
            // Skip if a vi translation already exists and already has a title
            $existing = DB::table('lotus_product_translations')
                ->where('lotus_product_id', $product->id)
                ->where('locale', 'vi')
                ->first();

            if ($existing) {
                // Only update fields that are currently null in the translation table
                $update = [];
                foreach ($columns as $col) {
                    if (empty($existing->{$col}) && !empty($product->{$col} ?? null)) {
                        $update[$col] = $product->{$col};
                    }
                }
                if (!empty($update)) {
                    $update['updated_at'] = now();
                    DB::table('lotus_product_translations')
                        ->where('id', $existing->id)
                        ->update($update);
                }
            } else {
                // Insert new vi translation row
                $insert = [
                    'lotus_product_id' => $product->id,
                    'locale'           => 'vi',
                    'created_at'       => now(),
                    'updated_at'       => now(),
                ];
                foreach ($columns as $col) {
                    $insert[$col] = $product->{$col} ?? null;
                }
                DB::table('lotus_product_translations')->insert($insert);
            }
        }
    }

    public function down(): void
    {
        // Remove only rows that were seeded (have null created_by marker is not possible,
        // so we leave down() as no-op to avoid data loss on rollback)
    }
};
