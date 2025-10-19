# ⚠️ ÖNEMLİ: VYNRYX PLATFORM VERİLERİ

## 🔴 "Clear Site Data" KULLANMAYIN!

### Sorun:
- Browser'ın **"Clear Site Data"** veya **"Site verilerini temizle"** özelliği **TÜM verileri** siler
- Bu GunDB P2P veritabanını da siler
- Total Users sayısı 0'a döner
- Tüm kullanıcı kayıtları gider

### ✅ Doğru Yöntem:

#### Sadece Çıkış Yapmak İçin:
```
Settings → Logout butonu
```
Bu sadece mevcut oturumunuzu kapatır, veriler korunur.

#### Kimliğinizi Silmek İçin:
```
Settings → Delete Identity
```
Bu sadece sizin kimliğinizi siler, global veriler korunur.

---

## 📊 Total Users Nasıl Çalışır?

### Veri Kaynağı: GunDB
```javascript
gun.get('vynryx').get('users') 
// Tüm kullanıcı kayıtlarını tutar
```

### Storage:
- **GunDB → localStorage** (key: `gun/...`)
- **User Profile → localStorage** (key: `vynryx_user`)
- **Wallet → localStorage** (key: `vynryx_wallet_...`)

### Clear Site Data Sonucu:
```
localStorage.clear()
↓
GunDB verisi silindi ❌
Total Users: 0
Tüm kullanıcı kayıtları kayboldu
```

### Logout Sonucu:
```
localStorage.removeItem('vynryx_user')
↓
GunDB verisi korundu ✅
Total Users: AYNI
Sadece oturum kapandı
```

---

## 🔧 Geliştirici Notu

Eğer test sırasında Total Users'ı sıfırlamak isterseniz:

### Tüm Verileri Sıfırla:
```javascript
// Browser Console'da
localStorage.clear()
// Sayfayı yenile
```

### Sadece Kullanıcı Oturumunu Sıfırla:
```javascript
// Browser Console'da
localStorage.removeItem('vynryx_user')
localStorage.removeItem('vynryx_profile')
// Sayfayı yenile
```

### GunDB Verilerini Koru:
```javascript
// Sadece VYNRYX user verilerini sil, GunDB verilerini koru
Object.keys(localStorage)
  .filter(key => key.startsWith('vynryx_') && !key.startsWith('gun/'))
  .forEach(key => localStorage.removeItem(key));
```

---

## 🎯 Platform Mimarisi

### Offline-First:
- GunDB localStorage mode
- Peer bağlantısı yok (şu an için)
- Her kullanıcı kendi localStorage'ında veri tutuyor

### Future: P2P Network
- Public peer'lar eklendiğinde
- Multi-device senkronizasyon
- Global user count gerçek zamanlı

---

## 💡 Öneriler

1. **Test sırasında**: Logout kullan, Clear Site Data kullanma
2. **Production'da**: Kullanıcılara uyarı göster
3. **Gelecek**: Backend API ile global counter tutulabilir
4. **Alternatif**: IndexedDB kullanılabilir (ama o da browser clear'da silinir)

---

**ÖNEMLİ**: Bu bir P2P platform, merkezi veritabanı yok. LocalStorage temizlenirse veriler kaybolur!
