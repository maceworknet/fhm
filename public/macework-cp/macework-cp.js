(function () {
    const BRAND = {
        cmsName: 'Macework',
        logos: {
            light: {
                nav: '/macework-cp/macework-logo-nav.svg',
                outside: '/macework-cp/macework-logo-light.svg',
            },
            dark: {
                nav: '/macework-cp/macework-logo-nav.svg',
                outside: '/macework-cp/macework-logo-dark.svg',
            },
        },
    };

    function patchStatamicProps(page) {
        if (!page || typeof page !== 'object') {
            return page;
        }

        page.props = page.props || {};
        page.props._statamic = page.props._statamic || {};

        const existingLogos = page.props._statamic.logos || {};

        page.props._statamic.cmsName = BRAND.cmsName;
        page.props._statamic.logos = {
            ...existingLogos,
            text: null,
            siteName: BRAND.cmsName,
            light: {
                ...(existingLogos.light || {}),
                ...BRAND.logos.light,
            },
            dark: {
                ...(existingLogos.dark || {}),
                ...BRAND.logos.dark,
            },
        };

        return page;
    }

    function patchInitialPagePayload() {
        const root = document.getElementById('statamic');

        if (!root) {
            return;
        }

        const rawPage = root.getAttribute('data-page');

        if (!rawPage) {
            return;
        }

        try {
            const page = JSON.parse(rawPage);
            patchStatamicProps(page);
            root.setAttribute('data-page', JSON.stringify(page));
        } catch (error) {
            console.warn('[Macework CP] Initial page payload could not be patched.', error);
        }
    }

    function patchHistoryState() {
        try {
            const state = window.history.state;

            if (state && state.page) {
                patchStatamicProps(state.page);
                window.history.replaceState(state, '', window.location.href);
            }
        } catch (error) {
            console.warn('[Macework CP] History state could not be patched.', error);
        }
    }

    function syncBladeTitle() {
        const bladeTitle = document.getElementById('blade-title');

        if (!bladeTitle) {
            return;
        }

        const title = bladeTitle.getAttribute('data-title') || '';

        if (title.includes('Statamic')) {
            bladeTitle.setAttribute('data-title', title.replace(/Statamic/g, BRAND.cmsName));
        }
    }

    function syncDocumentTitle() {
        if (typeof document.title === 'string' && document.title.includes('Statamic')) {
            document.title = document.title.replace(/Statamic/g, BRAND.cmsName);
        }
    }

    function brandOutsideLogo() {
        const outsideLogo = document.querySelector('.outside .logo');

        if (!outsideLogo || outsideLogo.querySelector('[data-macework-cp-outside-logo="light"]')) {
            return;
        }

        outsideLogo.innerHTML = [
            '<img',
            'src="' + BRAND.logos.light.outside + '"',
            'alt="' + BRAND.cmsName + '"',
            'class="white-label-logo dark:hidden macework-cp-outside-logo"',
            'data-macework-cp-outside-logo="light"',
            '/>',
            '<img',
            'src="' + BRAND.logos.dark.outside + '"',
            'alt="' + BRAND.cmsName + '"',
            'class="white-label-logo hidden dark:block macework-cp-outside-logo"',
            'data-macework-cp-outside-logo="dark"',
            '/>',
        ].join(' ');
    }

    function brandHeaderLogo() {
        const headerLogoLink = document.querySelector('header.bg-global-header-bg > div:first-of-type a[href$="/cp"]');

        if (!headerLogoLink) {
            return;
        }

        const existingLogo = headerLogoLink.querySelector('[data-macework-cp-nav-logo]');

        if (existingLogo) {
            existingLogo.setAttribute('src', BRAND.logos.dark.nav);
            existingLogo.setAttribute('alt', BRAND.cmsName);
            return;
        }

        headerLogoLink.innerHTML = '';
        headerLogoLink.setAttribute('aria-label', BRAND.cmsName);

        const image = document.createElement('img');
        image.src = BRAND.logos.dark.nav;
        image.alt = BRAND.cmsName;
        image.className = 'macework-cp-nav-logo';
        image.setAttribute('data-macework-cp-nav-logo', '');

        headerLogoLink.appendChild(image);
    }

    function applyBranding() {
        syncBladeTitle();
        syncDocumentTitle();
        patchHistoryState();
        brandOutsideLogo();
        brandHeaderLogo();
    }

    let scheduled = false;

    function scheduleBranding() {
        if (scheduled) {
            return;
        }

        scheduled = true;

        window.requestAnimationFrame(function () {
            scheduled = false;
            applyBranding();
        });
    }

    patchInitialPagePayload();
    applyBranding();

    document.addEventListener('DOMContentLoaded', scheduleBranding);
    window.addEventListener('load', scheduleBranding);
    document.addEventListener('inertia:navigate', function (event) {
        if (event && event.detail && event.detail.page) {
            patchStatamicProps(event.detail.page);
        }

        scheduleBranding();
    });
    document.addEventListener('inertia:success', function (event) {
        if (event && event.detail && event.detail.page) {
            patchStatamicProps(event.detail.page);
        }

        scheduleBranding();
    });

    const observer = new MutationObserver(scheduleBranding);
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        characterData: true,
    });
})();
