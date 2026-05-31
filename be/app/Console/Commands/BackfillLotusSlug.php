<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Str;
use App\Models\Lotus\LotusProduct;
use App\Models\Lotus\LotusCategory;
use App\Models\Lotus\LotusTeam;

class BackfillLotusSlug extends Command
{
    protected $signature   = 'lotus:backfill-slug';
    protected $description = 'Tự động sinh slug cho các bản ghi Lotus đang bị rỗng';

    public function handle(): void
    {
        $this->backfill(LotusProduct::class,  'title');
        $this->backfill(LotusCategory::class, 'title');
        $this->backfill(LotusTeam::class,     'name');

        $this->info('✅ Backfill slug hoàn tất!');
    }

    private function backfill(string $model, string $sourceField): void
    {
        $empty = $model::whereNull('slug')
            ->orWhere('slug', '')
            ->get();

        $count = 0;
        foreach ($empty as $record) {
            if (empty($record->{$sourceField})) {
                continue;
            }

            $base = Str::slug($record->{$sourceField});
            $slug = $base;
            $i    = 1;

            while ($model::where('slug', $slug)->where('id', '!=', $record->id)->exists()) {
                $slug = $base . '-' . $i++;
            }

            $model::withoutTimestamps(fn () =>
                $record->updateQuietly(['slug' => $slug])
            );

            $count++;
        }

        $shortName = class_basename($model);
        $this->line("  {$shortName}: cập nhật {$count} slug");
    }
}
