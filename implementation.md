# IMPLEMENTATION.md

## Genel Amaç
Bu doküman FHM GROUP için geliştirilecek Statamic + Antlers + Tailwind projesinin teknik implementasyon yol haritasını içerir.

## 1. Önerilen Klasör Yapısı

```text
resources/
  views/
    layout.antlers.html
    home.antlers.html
    default.antlers.html
    services/
      index.antlers.html
      show.antlers.html
    projects/
      index.antlers.html
      show.antlers.html
    blog/
      index.antlers.html
      show.antlers.html
    contact.antlers.html
    partials/
      header.antlers.html
      mobile-menu.antlers.html
      footer.antlers.html
      hero.antlers.html
      section-heading.antlers.html
      service-card.antlers.html
      project-card.antlers.html
      blog-card.antlers.html
      cta-banner.antlers.html
      stats-strip.antlers.html
      breadcrumb.antlers.html
      contact-block.antlers.html

content/
  collections/
    pages/
    services/
    projects/
    blog/

resources/blueprints/
  collections/
    pages/
      page.yaml
    services/
      service.yaml
    projects/
      project.yaml
    blog/
      post.yaml
  globals/
    site_settings.yaml
    contact_settings.yaml
    cta_settings.yaml

content/globals/
  site_settings.yaml
  contact_settings.yaml
  cta_settings.yaml

content/trees/navigation/
  main.yaml
  footer.yaml

resources/css/
  site.css

resources/js/
  site.js