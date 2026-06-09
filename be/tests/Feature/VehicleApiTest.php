<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Vehicle\Vehicle;
use App\Models\Vehicle\VehicleCategory;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class VehicleApiTest extends TestCase
{
    use DatabaseTransactions;

    public function test_can_get_vehicle_with_layout_blocks()
    {
        $category = VehicleCategory::create([
            'status' => 'ACTIVE',
            'sort_order' => 1
        ]);
        $category->fill([
            'vi' => ['title' => 'SUV', 'slug' => 'suv'],
        ])->save();

        $vehicle = Vehicle::create([
            'category_id' => $category->id,
            'type' => 'suv',
            'base_price' => 700000000,
            'status' => 'ACTIVE',
            'layout_blocks' => [
                [
                    'type' => 'HeroBanner',
                    'data' => [
                        'title' => 'Ford Territory Test',
                        'background_image' => 'uploads/test.png'
                    ]
                ]
            ]
        ]);
        $vehicle->fill([
            'vi' => [
                'title' => 'Ford Territory Test',
                'slug' => 'ford-territory-test',
            ]
        ])->save();

        $response = $this->getJson('/api/vehicles/ford-territory-test');

        $response->assertStatus(200);
        $response->assertJsonPath('data.layout_blocks.0.type', 'HeroBanner');
        $response->assertJsonPath('data.layout_blocks.0.data.background_image', static_url('test.png'));
    }

    public function test_can_update_vehicle_layout_blocks()
    {
        $category = VehicleCategory::create([
            'status' => 'ACTIVE',
            'sort_order' => 1
        ]);
        $category->fill([
            'vi' => ['title' => 'SUV', 'slug' => 'suv'],
        ])->save();

        $vehicle = Vehicle::create([
            'category_id' => $category->id,
            'type' => 'suv',
            'base_price' => 700000000,
            'status' => 'ACTIVE',
            'layout_blocks' => []
        ]);
        $vehicle->fill([
            'vi' => [
                'title' => 'Ford Territory Test',
                'slug' => 'ford-territory-test',
            ]
        ])->save();

        $newLayout = [
            [
                'type' => 'AccordionFAQs',
                'data' => [
                    'faqs' => [
                        ['q' => 'Hoi?', 'a' => 'Dap.']
                    ]
                ]
            ]
        ];

        $response = $this->putJson("/api/vehicles/ford-territory-test/layout", [
            'layout_blocks' => $newLayout
        ]);

        $response->assertStatus(200);
        $this->assertEquals($newLayout, $vehicle->refresh()->layout_blocks);
    }

    public function test_can_upload_image()
    {
        $file = UploadedFile::fake()->image('avatar.jpg');

        $response = $this->postJson('/api/upload', [
            'file' => $file,
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'path',
            'url'
        ]);

        $path = $response->json('path');
        if (file_exists(public_path($path))) {
            unlink(public_path($path));
        }
    }
}
