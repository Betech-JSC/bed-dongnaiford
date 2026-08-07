<?php

namespace App\Http\Controllers\Api;

use Illuminate\Routing\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use JamstackVietnam\Redirect\Models\Redirect;
use Illuminate\Support\Facades\Cache;

class RedirectLookupController extends Controller
{
    public function lookup(Request $request): JsonResponse
    {
        $url = $request->query('url');
        if (empty($url)) {
            return response()->json(['success' => false, 'message' => 'URL parameter is required'], 400);
        }

        $path = parse_url($url, PHP_URL_PATH);
        $path = trim($path, '/');

        if (empty($path)) {
            $path = '/';
        }

        $cacheKey = 'redirect_lookup_' . md5($path);
        
        $redirectData = Cache::remember($cacheKey, 3600, function() use ($path) {
            $redirect = Redirect::active()
                ->where('old_url', $path)
                ->latest()
                ->first();

            if ($redirect) {
                $newUrl = $redirect->new_url;
                if ($newUrl !== '/' && !str_starts_with($newUrl, 'http://') && !str_starts_with($newUrl, 'https://')) {
                    $newUrl = '/' . ltrim($newUrl, '/');
                }
                return [
                    'new_url' => $newUrl,
                    'status_code' => (int) $redirect->status_code,
                ];
            }
            
            return 'none';
        });

        if ($redirectData && $redirectData !== 'none') {
            return response()->json([
                'success' => true,
                'redirect' => $redirectData
            ]);
        }

        return response()->json([
            'success' => true,
            'redirect' => null
        ]);
    }
}
