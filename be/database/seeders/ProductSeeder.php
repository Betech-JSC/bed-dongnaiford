<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product\Product;
use App\Models\Product\ProductCategory;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // 1. Create Categories if not exist (or fetch existing)
        $categories = ProductCategory::all();
        
        if ($categories->isEmpty()) {
            // Create dummy categories if none exist
            $this->command->info('No categories found. Creating demo categories...');
            
            $categoryNames = ['Trái cây tươi', 'Trái cây sấy', 'Nước ép', 'Quà tặng'];
            
            foreach ($categoryNames as $index => $name) {
                $cat = ProductCategory::create([
                    'status' => ProductCategory::STATUS_ACTIVE,
                    'position' => $index,
                ]);
                
                // Manually create translation for simplicity or use factory if available
                $cat->translations()->create([
                    'locale' => 'vi',
                    'title' => $name,
                    'slug' => \Illuminate\Support\Str::slug($name),
                ]);
                 $cat->translations()->create([
                    'locale' => 'en',
                    'title' => $name . ' (EN)',
                    'slug' => \Illuminate\Support\Str::slug($name) . '-en',
                ]);
                
                $categories->push($cat);
            }
        }

        // 2. Create Products
        $this->command->info('Creating products...');
        
        // Ensure Factory is used from correct namespace
        // Since we didn't register the factory path in AppServiceProvider, we might need to be careful.
        // But Database\Factories\Product\ProductFactory is standard enough if namespaced correctly.
        // We might need to tell the model where its factory is if it's not standard.
        // Product::factory() looks for Database\Factories\ProductFactory by default for App\Models\Product.
        // Since we put it in Database\Factories\Product\ProductFactory, we might need to specify it.
        
        // Let's try explicit factory class usage if needed, or rely on Laravel's discovery.
        // Laravel 8+ usually finds Database\Factories\ModelNameFactory.
        // Our Model: App\Models\Product\Product.
        // Factory: Database\Factories\Product\ProductFactory.
        // This matches standard Model Factory discovery conventions for nested models.
        
        Product::factory()
            ->count(20)
            ->create()
            ->each(function ($product) use ($categories) {
                // Attach random categories
                // Ensure we don't request more categories than available
                $count = $categories->count();
                if ($count > 0) {
                     $take = min($count, rand(1, 2));
                     $product->categories()->attach(
                        $categories->random($take)->pluck('id')->toArray()
                     );
                }
            });
            
        $this->command->info('Product seeding completed.');
    }
}
