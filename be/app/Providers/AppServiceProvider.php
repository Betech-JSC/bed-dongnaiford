<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Log;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        try {
            if (Schema::hasTable('settings')) {
                $smtp = \DB::table('settings')
                    ->where('group', 'smtp')
                    ->get();

                $mailHost = $smtp->firstWhere('name', 'mail_host')?->val ?: env('MAIL_HOST', 'smtp.gmail.com');
                $mailPort = $smtp->firstWhere('name', 'mail_port')?->val ?: env('MAIL_PORT', 587);
                $mailEncryption = $smtp->firstWhere('name', 'mail_encryption')?->val ?: env('MAIL_ENCRYPTION', 'tls');
                $mailUsername = $smtp->firstWhere('name', 'mail_username')?->val ?: env('MAIL_USERNAME');
                $mailPassword = $smtp->firstWhere('name', 'mail_password')?->val ?: env('MAIL_PASSWORD');
                $mailFromName = $smtp->firstWhere('name', 'mail_from_name')?->val ?: env('MAIL_FROM_NAME', config('app.name', 'Đồng Nai Ford'));
                $mailFromAddress = $smtp->firstWhere('name', 'mail_from_address')?->val ?: env('MAIL_FROM_ADDRESS', $mailUsername);

                config([
                    'mail.from.name' => $mailFromName,
                    'mail.from.address' => $mailFromAddress,
                    'mail.mailers.smtp.host' => $mailHost,
                    'mail.mailers.smtp.port' => (int)$mailPort,
                    'mail.mailers.smtp.encryption' => $mailEncryption,
                    'mail.mailers.smtp.username' => $mailUsername,
                    'mail.mailers.smtp.password' => $mailPassword,
                ]);
            }
        } catch (\Throwable $e) {
            // Fail silently when database is not ready (e.g. during docker build)
        }
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        // Fix: Doctrine DBAL không hỗ trợ kiểu 'enum' của MariaDB/MySQL
        try {
            \DB::connection()->getDoctrineSchemaManager()
                ->getDatabasePlatform()
                ->registerDoctrineTypeMapping('enum', 'string');
        } catch (\Throwable $e) {
            // Bỏ qua nếu driver không hỗ trợ
        }
    }
}
