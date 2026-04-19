<!DOCTYPE html>
<html
    lang="{{ str_replace('_', '-', Statamic::cpLocale()) }}"
    dir="{{ Statamic::cpDirection() }}"
>
    <head>
        @include('statamic::partials.head')
    </head>

    <body
        @if ($user && $user->getPreference('strict_accessibility')) data-contrast="increased" @endif
    >
        <div
            id="statamic"
            data-page="{{ json_encode($page ?? Statamic::nonInertiaPageData()) }}"
        >
            <div id="blade-title" data-title="
                @yield('title', $title ?? __('Here')) {{ Statamic::cpDirection() === 'ltr' ? '‹' : '›' }}
                {{ __(config('statamic.cp.custom_cms_name', config('app.name', 'Statamic'))) }}
            "></div>
            @yield('content')
        </div>

        <script src="{{ asset('macework-cp/macework-cp.js') }}?v={{ Statamic::version() }}"></script>
        @include('statamic::partials.scripts')
        @yield('scripts')
    </body>
</html>
