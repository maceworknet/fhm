<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class CustomizeStatamicBranding
{
    public function handle(Request $request, Closure $next): Response
    {
        $cmsName = config('statamic.cp.custom_cms_name', 'Macework');
        $light = $this->normalizeLogoConfig(config('statamic.cp.custom_logo_url'));
        $dark = $this->normalizeLogoConfig(config('statamic.cp.custom_dark_logo_url'));
        $sharedStatamic = Inertia::getShared('_statamic');

        config(['app.name' => $cmsName]);

        Inertia::share([
            '_statamic' => array_replace_recursive(is_array($sharedStatamic) ? $sharedStatamic : [], [
                'cmsName' => __($cmsName),
                'logos' => [
                    'text' => null,
                    'siteName' => $cmsName,
                    'light' => [
                        'nav' => $light['nav'],
                        'outside' => $light['outside'],
                    ],
                    'dark' => [
                        'nav' => $dark['nav'] ?? $light['nav'],
                        'outside' => $dark['outside'] ?? $light['outside'],
                    ],
                ],
            ]),
        ]);

        return $next($request);
    }

    protected function normalizeLogoConfig(mixed $config): array
    {
        if (is_string($config)) {
            return [
                'nav' => $config,
                'outside' => $config,
            ];
        }

        if (! is_array($config)) {
            return [
                'nav' => null,
                'outside' => null,
            ];
        }

        return [
            'nav' => $config['nav'] ?? null,
            'outside' => $config['outside'] ?? ($config['nav'] ?? null),
        ];
    }
}
