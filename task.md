# TASK.md

## Görev Tanımı
FHM GROUP için Statamic tabanlı, Antlers kullanan, Tailwind CSS ile tasarlanmış modern bir kurumsal web sitesi altyapısı oluştur.

## Ana Görev
Mevcut FHM GROUP sitesinin bilgi mimarisini ve kurumsal içeriğini daha güçlü bir kullanıcı deneyimiyle yeniden sunacak özel bir Statamic tema sistemi geliştir.

## Yapılacak İşler

### 1. Proje Altyapısını Hazırla
- Mevcut Statamic projesini baz al
- Gerekli klasör yapısını düzenle
- Tailwind CSS ve Vite kurulumunu doğrula
- Antlers template yapısını aktif olarak kullan

### 2. İçerik Modelini Kur
Aşağıdaki içerik tipleri için yapı oluştur:
- Pages
- Services
- Projects
- Blog

Her içerik tipi için uygun field yapıları ve blueprintler tasarla.

### 3. Global Ayarları Kur
Aşağıdaki alanlar için globals oluştur:
- Site ayarları
- İletişim bilgileri
- Sosyal medya linkleri
- Footer bilgileri
- Teklif CTA alanları

### 4. Navigation Yapısını Oluştur
- Header menü
- Footer menü
- Gerekirse hızlı linkler

### 5. Tema İskeletini Oluştur
Aşağıdaki ana dosyaları kur:
- layout.antlers.html
- home.antlers.html
- default.antlers.html
- service/index ve detail şablonları
- project/index ve detail şablonları
- blog/index ve detail şablonları
- contact.antlers.html

### 6. Partial Yapısını Kur
Aşağıdaki partial bileşenleri oluştur:
- header
- mobile-menu
- footer
- hero
- section-heading
- service-card
- project-card
- blog-card
- cta-banner
- stats-strip
- breadcrumb
- contact-block

### 7. Anasayfa Yapısını Oluştur
Ana sayfada şu bloklar yer almalı:
- Hero
- Kurumsal güven alanı
- Hizmet kartları
- Öne çıkan projeler
- Çalışma süreci
- Blog/İçerik alanı
- Güçlü CTA
- Footer

### 8. Responsive Tasarım Uygula
- Mobil
- Tablet
- Desktop

Tüm kırılımlarda düzenli spacing ve okunabilirlik korunmalı.

### 9. UI Kalitesini Artır
- Tipografi hiyerarşisi kur
- Görsel oranlarını düzenle
- Tutarlı spacing sistemi uygula
- CTA butonlarını güçlendir
- Hizmet ve proje kartlarını modernleştir

### 10. İçerik Yönetimini Kolaylaştır
- Blueprints alan isimleri açık olsun
- Editör tarafında gereksiz alan bulunmasın
- Kullanıcı panelden kolayca içerik ekleyebilsin

## Öncelik Sırası
1. İçerik modeli
2. Tema klasör yapısı
3. Base layout
4. Header/footer
5. Anasayfa
6. İç sayfalar
7. Responsive polish
8. İçerik yönetim kolaylaştırmaları

## Tamamlanma Kriterleri
Görev şu şartlarda tamamlanmış sayılır:
- Statamic panelde içerik tipleri düzgün görünüyor
- Antlers şablonları çalışıyor
- Tailwind ile tasarım uygulanmış durumda
- Ana sayfa ve temel iç sayfalar hazır
- Mobil görünüm sorunsuz
- Tema kurumsal ve modern görünüyor
- Kod yapısı modüler ve tekrar kullanılabilir

## Özel Not
Tema FHM GROUP’e özel hissettirmeli ancak gelecekte farklı kurumsal müşterilere uyarlanabilecek kadar sistematik kurulmalıdır.