Oguz-ToDo

Oguz-ToDo, kişisel görev takibini yönetmek amacıyla Next.js ve Supabase kullanılarak geliştirilmiş tam kapsamlı (full-stack) bir web uygulamasıdır. Row Level Security (RLS) mimarisi sayesinde her kullanıcının yalnızca kendi verilerine erişebildiği izole ve güvenli bir yapı sunar.

Proje Özellikleri

Kimlik Doğrulama: Supabase Auth ile güvenli kullanıcı kayıt ve giriş işlemleri. (test açamasında olduğu için mail doğrulamasını kaldırdım.)

Veri İzolasyonu: Supabase Row Level Security (RLS) politikaları ile kullanıcı verilerinin birbirinden tamamen ayrılması.

Görev Yönetimi: Yeni görev ekleme, düzenleme, arşive kaldırma ve kalıcı olarak silme işlemleri.

Öncelik ve Tarih Takibi: Görevler için öncelik seviyesi (Normal, Yüksek, Acil) ve son teslim tarihi (Due Date) belirleyebilme; tarihi geçen görevlerin otomatik olarak "başarısız" sayılması.

Tema Desteği: Kullanıcı tercihine göre şekillenen açık ve koyu tema seçenekleri.

Tasarım: Modern, duyarlı (responsive) ve tüm cihazlarla uyumlu kullanıcı arayüzü.

Kullanılan Teknolojiler

Framework: Next.js 16 (App Router)

Dil: JavaScript

Veritabanı ve Auth: Supabase (PostgreSQL)

Stil Yönetimi: Vanilla CSS

Bildirim ve Etkileşim: Toastify JS ve SweetAlert2

Yapay Zeka Kullanım Raporu

Bu projenin geliştirilme sürecinde yapay zeka araçları bir kod yazıcı olarak kullanılmıştır.

Yapay Zekanın Kullanıldığı Alanlar:

Veritabanı Modellemesi: Supabase PostgreSQL tablolarının oluşturulması ve özellikle Row Level Security (RLS) politikalarının doğru sözdizimi ile yazılmasında doğrulama aracı olarak kullanıldı.

Next.js Mimarisi: App Router yapısına geçerken "Client Component" ve "Server Component" ayrımlarının planlanmasında fikir alışverişi yapıldı.

İstemci Kütüphaneleri: SweetAlert2 ve Toastify gibi DOM manipülasyonu gerektiren kütüphanelerin React/Next.js yaşam döngüsüne (useEffect kancaları) hatasız entegre edilmesi için boilerplate kodlar elde edildi.

Yapay Zeka Çıktılarında Yapılan Değişiklikler:

Component Bölünmesi: Yapay zeka modüler yapıyı karmaşıklaştırma eğilimindeydi. Kodun okunabilirliğini ve yönetilebilirliğini artırmak için UI elementleri (Sidebar, Topbar, TodoCard, TodoModal) tarafımca planlanarak ayrı bileşenlere bölündü.

Veri Çekme Optimizasyonu: Supabase'den dönen verilerin işlenmesi ve state üzerine aktarılması sırasında AI tarafından önerilen bazı karmaşık asenkron (async/await) yapıları, performansı artırmak adına tarafımca sadeleştirildi.

Tamamen Tarafıma Ait Olan Kısımlar:

İş Mantığı ve Akış: Görevlerin arşive alınması, tarihe göre başarısız sayılması ve kategorilerin kullanıcı bazlı izole çalışması gibi ürün vizyonu gerektiren mantıksal kararlar tarafıma aittir.

UX/UI Kararları: Uygulamanın koyu/açık tema renkleri, bileşenlerin ekrandaki yerleşimi ve son kullanıcı deneyimini doğrudan etkileyen tasarım tercihleri tamamen benim kontrolümde şekillendirilmiştir.