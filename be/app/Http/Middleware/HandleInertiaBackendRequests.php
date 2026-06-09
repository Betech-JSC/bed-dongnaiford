<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Illuminate\Support\Str;
use JamstackVietnam\Contact\Models\Contact;
use App\Models\Vehicle\Vehicle;
use App\Models\Post\Post;
use Carbon\Carbon;

class HandleInertiaBackendRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'backend::app';

    /**
     * Determine the current asset version.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    public function version(Request $request)
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function share(Request $request)
    {
        $sliderPositions = [];
        foreach (config('slider.positions') as $key => $value) {
            $sliderPositions[] = [
                'id' => $key,
                'label' => $value['title']
            ];
        };

        $newContact = Contact::where('status', Contact::STATUS_NEW)->get();
        $todayContact = Contact::whereDate('created_at', Carbon::today())->get();

        $totalVehicles = Vehicle::count();
        $totalPosts = Post::count();

        $data = [
            'flash' => function () use ($request) {
                return [
                    'success' => $request->session()->get('success'),
                    'error' => $request->session()->get('error'),
                ];
            },
            'locale' => [
                'current' => current_locale(),
                'default' => config('app.locale'),
                'list' => config('app.locales'),
            ],
            'route' => [
                'url' => $request->url(),
                'path' => $request->path(),
                'name' => $request->route()->getName(),
                'query' => $request->query(),
            ],
            'data' => [
                'slider' => [
                    'position_display' => $sliderPositions
                ],
                'new_contact_count' => $newContact->where('type', 'CONTACT_FORM')->count(),
                'new_apply_count' => $newContact->where('type', 'APPLY_FORM')->count(),
                'new_advise_count' => $newContact->where('type', 'ADVISE_FORM')->count(),
                'today_contact_count' => $todayContact->where('type', 'CONTACT_FORM')->count(),
                'today_apply_count' => $todayContact->where('type', 'APPLY_FORM')->count(),
                'today_advise_count' => $todayContact->where('type', 'ADVISE_FORM')->count(),
                'new_order_count' => 0,
                'today_order_count' => 0,
                'today_order_total_price' => 0,
                'total_vehicles_count' => $totalVehicles,
                'total_posts_count' => $totalPosts,
            ]
        ];

        if ($admin = auth()->guard('admin')->user()) {
            $data['admin']  = array_merge(
                $admin->toArray(),
                [
                    'permissions' => $admin->getAllPermissions()->pluck('name')->values(),
                ]
            );
        }

        return array_merge(parent::share($request), $data);
    }

    public function getUserAbilities($user)
    {
        $abilities = $user->getAbilities()->merge($user->getForbiddenAbilities());

        $abilities->each(function ($ability) use ($user) {
            $ability->forbidden = $user->getForbiddenAbilities()->contains($ability);
            $ability->entity_type = Str::snake(Str::plural(class_basename($ability->entity_type)));
        });

        return $abilities->toArray();
    }
}
