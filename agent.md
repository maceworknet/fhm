# AGENT.md

## Proje Adı
FHM GROUP - Statamic Kurumsal Web Sitesi Yenileme

## Proje Amacı
Mevcut FHM GROUP web sitesini daha modern, kullanıcı dostu, hızlı ve kurumsal açıdan daha güçlü bir yapıya dönüştürmek. Proje Statamic CMS, Antlers template sistemi ve Tailwind CSS kullanılarak geliştirilecektir.

## Ana Hedefler
- Mevcut sitenin bilgi mimarisini koruyarak UX ve UI kalitesini ciddi biçimde artırmak
- Yönetilebilir, modüler ve yeniden kullanılabilir bir Statamic yapı kurmak
- Antlers ile temiz, okunabilir ve sürdürülebilir tema altyapısı oluşturmak
- Tailwind CSS ile modern, responsive ve performanslı arayüz geliştirmek
- FHM'nin hizmetlerini, projelerini ve kurumsal gücünü daha ikna edici biçimde sunmak
- Sonuçta ortaya çıkacak sistemi başka kurumsal müşteri projelerine de adapte edilebilir hale getirmek

## Teknoloji Kararları
- CMS: Statamic
- Template Engine: Antlers
- Styling: Tailwind CSS
- Backend Temeli: Laravel
- Local Development: Laragon
- İçerik Yönetimi: Collections, Blueprints, Globals, Navigation
- Varlık Yönetimi: Assets Container
- Derleme: Vite

## Geliştirme Yaklaşımı
Bu proje hazır tema uyarlaması değil, FHM GROUP için özel geliştirilen bir kurumsal tema olacaktır. Kod yapısı temiz, modüler ve tekrar kullanılabilir olmalıdır. Tüm bileşenler sonradan başka sektörlerde de kullanılabilecek kadar sistematik tasarlanmalıdır.

## Çalışma Prensipleri
1. Önce içerik modeli oluşturulacak
2. Sonra tema iskeleti kurulacak
3. Ardından sayfalar modüler bileşenlerle inşa edilecek
4. Tasarım kararları mobil uyumluluk ve okunabilirlik öncelikli olacak
5. Gereksiz eklenti, gereksiz bağımlılık ve karmaşık yapıdan kaçınılacak
6. Kod mümkün olduğunca sade, ölçeklenebilir ve yorumlanabilir olacak

## İçerik Yapısı Öncelikleri
Aşağıdaki içerik türleri önceliklidir:
- Kurumsal sayfalar
- Hizmetler
- Projeler
- Blog / Haberler
- İletişim bilgileri
- Teklif çağrıları
- Sık kullanılan CTA alanları

## Kullanıcı Deneyimi Öncelikleri
- Ana sayfada güçlü hero alanı
- Hızlı güven oluşturan kurumsal bloklar
- Hizmetlerin net ve sade kartlar halinde sunulması
- Projelerin referans/case-study mantığında listelenmesi
- Mobilde hızlı iletişim ve teklif çağrısı
- Tüm sayfalarda okunabilir tipografi ve düzenli boşluk kullanımı

## Beklenen Çıktılar
Ajan aşağıdaki çıktıları üretmelidir:
- Statamic içerik modeli
- Gerekli blueprints
- Collections ve globals
- Navigation yapısı
- Antlers tema klasör yapısı
- Base layout ve partial dosyaları
- Home page, hizmetler, projeler, blog, iletişim şablonları
- Tailwind konfigürasyonu
- Responsive frontend
- Kurumsal, modern ve güven veren tasarım

## Yasaklar / Kaçınılacaklar
- Generic, stock hissi veren hero tasarımları
- Aşırı yuvarlak, oyunlaştırılmış veya startup tarzı tasarımlar
- Aşırı animasyon
- Dağınık grid yapısı
- Uzun ve sıkıcı metin blokları
- Her bölümde farklı tasarım dili
- WordPress benzeri ağır ve karışık panel mantığı

## Tasarım Dili
- Endüstriyel
- Kurumsal
- Güven veren
- Modern
- Sade ama güçlü
- Teknik yeterliliği hissettiren

## Hedef Kullanıcı
- Kurumsal müşteri
- İnşaat / mekanik / mühendislik sektöründen karar vericiler
- Müteahhitler
- Proje yöneticileri
- Satın alma ve teknik ekipler

## Son Not
Bu proje sadece bir web sitesi değil, ileride Macework benzeri yapılar için paketlenebilir bir "Statamic Corporate Engineering Theme" temelidir. Bu nedenle yapı olabildiğince reusable düşünülmelidir.