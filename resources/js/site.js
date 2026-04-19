document.documentElement.classList.add('has-js');

const slugifyText = (value = '') =>
    value
        .toString()
        .toLocaleLowerCase('tr-TR')
        .replaceAll('\u0131', 'i')
        .replaceAll('\u015f', 's')
        .replaceAll('\u011f', 'g')
        .replaceAll('\u00fc', 'u')
        .replaceAll('\u00f6', 'o')
        .replaceAll('\u00e7', 'c')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

const slugifyProvince = (value = '') => slugifyText(value);

const projectsMapRoot = document.querySelector('[data-projects-map]');

const initializeProjectsMap = (mapRoot, turkeyCities) => {
    const canvas = mapRoot.querySelector('[data-projects-map-canvas]');
    const backdrop = mapRoot.querySelector('[data-projects-map-backdrop]');
    const popup = mapRoot.querySelector('[data-projects-map-popup]');
    const popupCity = mapRoot.querySelector('[data-projects-map-city]');
    const popupList = mapRoot.querySelector('[data-projects-map-list]');
    const emptyState = mapRoot.querySelector('[data-projects-map-empty]');
    const projectLinks = Array.from(
        mapRoot.querySelectorAll('[data-projects-map-items] a[data-project-city]'),
    );
    const hoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const mobilePopupQuery = window.matchMedia('(max-width: 63.9375rem)');
    const cityProjects = new Map();
    let activeProvince = null;
    let hideTimer = null;

    if (!canvas || !popup || !popupCity || !popupList) return;

    projectLinks.forEach((link) => {
        const city = link.dataset.projectCity;
        if (!city) return;

        if (!cityProjects.has(city)) {
            cityProjects.set(city, []);
        }

        cityProjects.get(city).push({
            title: link.textContent?.trim() ?? '',
            url: link.getAttribute('href') ?? '#',
        });
    });

    if (emptyState) {
        emptyState.hidden = cityProjects.size > 0;
    }

    const projectionReference = (39 * Math.PI) / 180;
    const projectPoint = ([lon, lat]) => [lon * Math.cos(projectionReference), lat];
    const allPoints = [];

    turkeyCities.features.forEach((feature) => {
        const polygons =
            feature.geometry.type === 'Polygon'
                ? [feature.geometry.coordinates]
                : feature.geometry.coordinates;

        polygons.forEach((polygon) => {
            polygon.forEach((ring) => {
                ring.forEach((point) => {
                    allPoints.push(projectPoint(point));
                });
            });
        });
    });

    const projectedX = allPoints.map(([x]) => x);
    const projectedY = allPoints.map(([, y]) => y);
    const minX = Math.min(...projectedX);
    const maxX = Math.max(...projectedX);
    const minY = Math.min(...projectedY);
    const maxY = Math.max(...projectedY);
    const svgWidth = 1200;
    const padding = 18;
    const scale = (svgWidth - padding * 2) / (maxX - minX);
    const svgHeight = Math.round((maxY - minY) * scale + padding * 2);

    const formatPoint = ([lon, lat]) => {
        const [projectedLon, projectedLat] = projectPoint([lon, lat]);
        const x = (projectedLon - minX) * scale + padding;
        const y = (maxY - projectedLat) * scale + padding;
        return `${x.toFixed(2)} ${y.toFixed(2)}`;
    };

    const buildPathData = (geometry) => {
        const polygons =
            geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;

        return polygons
            .map((polygon) =>
                polygon
                    .map((ring) =>
                        ring
                            .map((point, index) =>
                                `${index === 0 ? 'M' : 'L'}${formatPoint(point)}`,
                            )
                            .join(' ')
                            .concat(' Z'),
                    )
                    .join(' '),
            )
            .join(' ');
    };

    canvas.innerHTML = `
        <svg viewBox="0 0 ${svgWidth} ${svgHeight}" class="projects-map-svg" role="img" aria-label="Turkiye proje haritasi">
            ${turkeyCities.features
                .map((feature) => {
                    const cityName = feature.properties.name;
                    const citySlug = slugifyProvince(cityName);
                    const hasProjects = cityProjects.has(citySlug);

                    return `
                        <path
                            d="${buildPathData(feature.geometry)}"
                            class="projects-map-province${hasProjects ? ' is-active' : ''}"
                            data-city-name="${cityName}"
                            data-city-slug="${citySlug}"
                            ${hasProjects ? 'tabindex="0" role="button"' : 'aria-hidden="true"'}
                        />
                    `;
                })
                .join('')}
        </svg>
    `;

    const activeProvinces = Array.from(
        canvas.querySelectorAll('.projects-map-province.is-active'),
    );

    const clearHideTimer = () => {
        if (hideTimer) {
            window.clearTimeout(hideTimer);
            hideTimer = null;
        }
    };

    const hidePopup = () => {
        clearHideTimer();
        popup.hidden = true;
        popup.classList.remove('is-visible');
        backdrop?.classList.remove('is-visible');
        if (backdrop) {
            backdrop.hidden = true;
        }
        activeProvince?.classList.remove('is-selected');
        activeProvince = null;
    };

    const scheduleHide = () => {
        clearHideTimer();
        hideTimer = window.setTimeout(() => {
            hidePopup();
        }, 120);
    };

    const positionPopup = (province) => {
        if (mobilePopupQuery.matches) {
            popup.style.left = '';
            popup.style.top = '';
            return;
        }

        const stageRect = mapRoot.getBoundingClientRect();
        const provinceRect = province.getBoundingClientRect();
        const popupRect = popup.getBoundingClientRect();
        const gutter = 12;
        let left =
            provinceRect.left - stageRect.left + provinceRect.width / 2 - popupRect.width / 2;
        let top = provinceRect.top - stageRect.top - popupRect.height - 16;

        left = Math.max(gutter, Math.min(left, stageRect.width - popupRect.width - gutter));

        if (top < gutter) {
            top = provinceRect.bottom - stageRect.top + 14;
        }

        popup.style.left = `${left}px`;
        popup.style.top = `${top}px`;
    };

    const showPopup = (province) => {
        const citySlug = province.dataset.citySlug;
        const cityName = province.dataset.cityName;
        const projects = cityProjects.get(citySlug);

        if (!citySlug || !cityName || !projects?.length) return;

        clearHideTimer();

        if (activeProvince && activeProvince !== province) {
            activeProvince.classList.remove('is-selected');
        }

        popupCity.textContent = cityName;
        popupList.innerHTML = '';

        projects.forEach((project) => {
            const item = document.createElement('li');
            item.className = 'projects-map-popup-item';

            const link = document.createElement('a');
            link.className = 'projects-map-popup-link';
            link.href = project.url;
            link.textContent = project.title;

            item.appendChild(link);
            popupList.appendChild(item);
        });

        if (backdrop) {
            backdrop.hidden = false;
            backdrop.classList.toggle('is-visible', mobilePopupQuery.matches);
        }

        popup.hidden = false;
        popup.classList.add('is-visible');
        province.classList.add('is-selected');
        activeProvince = province;
        positionPopup(province);
    };

    activeProvinces.forEach((province) => {
        province.addEventListener('mouseenter', () => {
            if (hoverQuery.matches) {
                showPopup(province);
            }
        });

        province.addEventListener('mouseleave', () => {
            if (hoverQuery.matches) {
                scheduleHide();
            }
        });

        province.addEventListener('focus', () => {
            showPopup(province);
        });

        province.addEventListener('blur', () => {
            if (hoverQuery.matches) {
                scheduleHide();
            }
        });

        province.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();

            if (hoverQuery.matches) {
                showPopup(province);
                return;
            }

            if (activeProvince === province && !popup.hidden) {
                hidePopup();
                return;
            }

            showPopup(province);
        });
    });

    popup.addEventListener('mouseenter', clearHideTimer);
    popup.addEventListener('mouseleave', scheduleHide);
    popup.addEventListener('focusin', clearHideTimer);
    popup.addEventListener('focusout', (event) => {
        if (!popup.contains(event.relatedTarget)) {
            scheduleHide();
        }
    });

    backdrop?.addEventListener('click', () => {
        hidePopup();
    });

    document.addEventListener('click', (event) => {
        if (!mapRoot.contains(event.target)) {
            hidePopup();
        }
    });

    window.addEventListener('resize', () => {
        if (activeProvince && !popup.hidden) {
            backdrop?.classList.toggle('is-visible', mobilePopupQuery.matches);
            positionPopup(activeProvince);
        }
    });

    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !popup.hidden) {
            hidePopup();
        }
    });
};

if (projectsMapRoot) {
    import('../data/tr-cities.geojson?raw')
        .then(({ default: rawTurkeyCities }) => {
            const turkeyCities = JSON.parse(rawTurkeyCities);
            initializeProjectsMap(projectsMapRoot, turkeyCities);
        })
        .catch(() => {
            const emptyState = projectsMapRoot.querySelector('[data-projects-map-empty]');
            if (emptyState) {
                emptyState.hidden = false;
                emptyState.textContent = 'Harita verisi yuklenemedi.';
            }
        });
}

const mobileToggle = document.querySelector('[data-mobile-menu-toggle]');
const mobileMenu = document.querySelector('[data-mobile-menu]');
const header = document.querySelector('[data-site-header]');
const backToTopButton = document.querySelector('[data-back-to-top]');
const menuLinks = document.querySelectorAll('[data-mobile-menu] a');
const mobileCloseButtons = document.querySelectorAll('[data-mobile-menu-close]');

const setMenuState = (isOpen) => {
    if (!mobileMenu || !mobileToggle) return;

    mobileMenu.classList.toggle('is-open', isOpen);
    mobileMenu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.body.classList.toggle('overflow-hidden', isOpen);
};

if (mobileToggle && mobileMenu) {
    setMenuState(false);

    mobileToggle.addEventListener('click', () => {
        const isOpen = mobileToggle.getAttribute('aria-expanded') === 'true';
        setMenuState(!isOpen);
    });

    mobileCloseButtons.forEach((button) => {
        button.addEventListener('click', () => setMenuState(false));
    });

    menuLinks.forEach((link) => {
        link.addEventListener('click', () => setMenuState(false));
    });

    window.addEventListener('keydown', (event) => {
        if (
            event.key === 'Escape' &&
            mobileToggle.getAttribute('aria-expanded') === 'true'
        ) {
            setMenuState(false);
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024) {
            setMenuState(false);
        }
    });
}

if (header) {
    let lastScrollY = window.scrollY;

    const syncHeaderState = () => {
        const currentScrollY = window.scrollY;
        const menuIsOpen =
            mobileToggle && mobileToggle.getAttribute('aria-expanded') === 'true';

        header.classList.toggle('is-scrolled', currentScrollY > 10);

        if (menuIsOpen) {
            header.classList.remove('is-hidden');
            lastScrollY = currentScrollY;
            return;
        }

        if (currentScrollY <= 0) {
            header.classList.remove('is-hidden');
            lastScrollY = currentScrollY;
            return;
        }

        const scrollingDown = currentScrollY > lastScrollY;
        const scrollingUp = currentScrollY < lastScrollY;

        if (scrollingDown && currentScrollY > 120) {
            header.classList.add('is-hidden');
        } else if (scrollingUp) {
            header.classList.remove('is-hidden');
        }

        lastScrollY = currentScrollY;
    };

    syncHeaderState();
    window.addEventListener('scroll', syncHeaderState, { passive: true });
}

if (backToTopButton) {
    const syncBackToTopState = () => {
        backToTopButton.classList.toggle('is-visible', window.scrollY > 420);
    };

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    });

    syncBackToTopState();
    window.addEventListener('scroll', syncBackToTopState, { passive: true });
}

const heroSlider = document.querySelector('[data-hero-slider]');

if (heroSlider) {
    const slides = Array.from(heroSlider.querySelectorAll('[data-hero-slide]'));
    const triggers = Array.from(heroSlider.querySelectorAll('[data-hero-trigger]'));
    const prevButton = heroSlider.querySelector('[data-hero-prev]');
    const nextButton = heroSlider.querySelector('[data-hero-next]');

    if (slides.length === 1) {
        heroSlider.classList.add('is-static');
    }

    if (slides.length > 0) {
        let activeIndex = slides.findIndex((slide) =>
            slide.classList.contains('is-active'),
        );

        if (activeIndex < 0) {
            activeIndex = 0;
        }

        const setActiveSlide = (index) => {
            const nextIndex = (index + slides.length) % slides.length;

            slides.forEach((slide, slideIndex) => {
                const isActive = slideIndex === nextIndex;
                slide.classList.toggle('is-active', isActive);
                slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
            });

            triggers.forEach((trigger, triggerIndex) => {
                const isActive = triggerIndex === nextIndex;
                trigger.classList.toggle('is-active', isActive);
                trigger.setAttribute('aria-pressed', isActive ? 'true' : 'false');
            });

            activeIndex = nextIndex;
        };

        prevButton?.addEventListener('click', () => {
            setActiveSlide(activeIndex - 1);
        });

        nextButton?.addEventListener('click', () => {
            setActiveSlide(activeIndex + 1);
        });

        triggers.forEach((trigger, triggerIndex) => {
            trigger.addEventListener('click', () => {
                setActiveSlide(triggerIndex);
            });
        });

        heroSlider.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                setActiveSlide(activeIndex - 1);
            }

            if (event.key === 'ArrowRight') {
                event.preventDefault();
                setActiveSlide(activeIndex + 1);
            }
        });

        setActiveSlide(activeIndex);
    }
}

const innerPageContent = document.querySelector('[data-inner-page-content]');
const innerPageNavWidgets = document.querySelectorAll('[data-inner-page-nav-widget]');

if (innerPageContent && innerPageNavWidgets.length) {
    const headings = Array.from(
        innerPageContent.querySelectorAll('h2, h3, h4'),
    ).filter((heading) => heading.textContent?.trim());
    const usedIds = new Set();
    const tocLinksById = new Map();

    headings.forEach((heading) => {
        const baseId = heading.id || slugifyText(heading.textContent || 'bolum');
        let resolvedId = baseId;
        let counter = 2;

        while (usedIds.has(resolvedId)) {
            resolvedId = `${baseId}-${counter}`;
            counter += 1;
        }

        usedIds.add(resolvedId);
        heading.id = resolvedId;
    });

    const setActiveHeading = (activeId) => {
        tocLinksById.forEach((links, id) => {
            links.forEach((link) => {
                const isActive = id === activeId;
                link.classList.toggle('is-active', isActive);
                link.setAttribute('aria-current', isActive ? 'true' : 'false');
            });
        });
    };

    const getActiveHeadingId = () => {
        const headerOffset =
            (document.querySelector('[data-site-header]')?.offsetHeight ?? 0) + 40;
        const scrollAnchor = window.scrollY + headerOffset;
        let activeId = headings[0]?.id ?? '';

        headings.forEach((heading) => {
            const headingTop = heading.getBoundingClientRect().top + window.scrollY;

            if (headingTop <= scrollAnchor) {
                activeId = heading.id;
            }
        });

        return activeId;
    };

    innerPageNavWidgets.forEach((widget) => {
        const list = widget.querySelector('[data-inner-page-nav-list]');

        if (!list || headings.length === 0) {
            widget.hidden = true;
            return;
        }

        list.innerHTML = '';

        headings.forEach((heading) => {
            const item = document.createElement('li');
            item.className = 'inner-page-toc-item';

            const link = document.createElement('a');
            link.className = 'inner-page-toc-link';
            link.href = `#${heading.id}`;
            link.textContent = heading.textContent?.trim() || '';
            link.dataset.targetId = heading.id;

            if (!tocLinksById.has(heading.id)) {
                tocLinksById.set(heading.id, []);
            }

            tocLinksById.get(heading.id)?.push(link);

            link.addEventListener('click', () => {
                setActiveHeading(heading.id);
            });

            item.appendChild(link);
            list.appendChild(item);
        });

        widget.hidden = false;
    });

    let tocTicking = false;

    const syncActiveHeading = () => {
        tocTicking = false;
        setActiveHeading(getActiveHeadingId());
    };

    const requestActiveHeadingSync = () => {
        if (tocTicking) return;

        tocTicking = true;
        window.requestAnimationFrame(syncActiveHeading);
    };

    requestActiveHeadingSync();
    window.addEventListener('scroll', requestActiveHeadingSync, { passive: true });
    window.addEventListener('resize', requestActiveHeadingSync);
    window.addEventListener('hashchange', requestActiveHeadingSync);
}

const revealItems = document.querySelectorAll('[data-reveal]');

if (revealItems.length) {
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.15,
            },
        );

        revealItems.forEach((item) => observer.observe(item));
    } else {
        revealItems.forEach((item) => item.classList.add('is-visible'));
    }
}
