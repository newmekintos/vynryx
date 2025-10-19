# 🪙 WAIQTION (WQT) TOKEN SİSTEMİ

## 💰 Waiqtion Nedir?

**Waiqtion (WQT)**, VYNRYX platformunda kullanılan **platform içi sanal para birimidir**. Sadece VYNRYX'te geçerlidir ve gerçek para değildir.

## 🎁 Nasıl Kazanılır?

### Yeni Kullanıcı Bonusu
- ✅ **Kayıt Bonusu**: 100 WQT
- ✅ **Günlük Giriş**: 5 WQT/gün

### Aktivite Kazançları
- 💼 **İş Tamamlama**: 50 WQT
- 🎨 **Servis Satışı**: 30 WQT
- ⭐ **Review Yazma**: 5 WQT
- ✅ **Profil Tamamlama**: 10 WQT
- 👥 **Referans**: 25 WQT

## 💸 Nasıl Harcanır?

### Platform Özellikleri
- 📢 **İlan Yayınlama**: 10 WQT
- 🛍️ **Servis Ekleme**: 5 WQT
- ⭐ **Öne Çıkan İlan**: 50 WQT
- 🚀 **Öne Çıkan Servis**: 30 WQT
- 📈 **Profil Boost**: 20 WQT
- 💬 **Chat Kilidi Açma**: 2 WQT

## 🔄 Transfer Sistemi

Kullanıcılar arası WQT transferi yapılabilir:
```typescript
WaiqtionWallet.transfer(from, to, amount, description)
```

## 📊 Cüzdan Sistemi

Her kullanıcının otomatik bir WQT cüzdanı oluşturulur:
- **Balance**: Mevcut bakiye
- **Earned**: Toplam kazanç
- **Spent**: Toplam harcama
- **Transactions**: İşlem geçmişi

## 🎯 WQT Felsefesi

1. **Platform İçi Sadakat**: WQT sadece VYNRYX'te kullanılır
2. **Gerçek Para Değil**: Kripto veya fiat para ile değiştirilmez
3. **Aktivite Teşviki**: Aktif kullanıcılar daha çok kazanır
4. **Sıfır Komisyon**: WQT ile işlemler komisyonsuz

## 💡 Örnek Senaryo

### Freelancer Perspektifi:
1. Kayıt ol → 100 WQT kazan
2. Profil tamamla → +10 WQT
3. 3 servis ekle → -15 WQT (3 x 5)
4. 2 servis sat → +60 WQT (2 x 30)
5. **Toplam**: 155 WQT

### İşveren Perspektifi:
1. Kayıt ol → 100 WQT kazan
2. Profil tamamla → +10 WQT
3. 2 ilan yayınla → -20 WQT (2 x 10)
4. 1 ilan öne çıkar → -50 WQT
5. **Toplam**: 40 WQT

## 🔐 Güvenlik

- ✅ LocalStorage'da saklanır
- ✅ Kullanıcı ID'sine bağlı
- ✅ İşlem geçmişi kayıtlı
- ✅ Negatif bakiye yok (yetersiz bakiye kontrolü)

## 📱 Kullanım

```typescript
import { WaiqtionWallet } from '@/lib/waiqtion';

// Bakiye kontrol
const balance = WaiqtionWallet.getBalance(userId);

// WQT kazan
WaiqtionWallet.earn(userId, 50, 'İş tamamlama bonusu');

// WQT harca
const success = WaiqtionWallet.spend(userId, 10, 'İlan yayınlama');

// Transfer yap
WaiqtionWallet.transfer(fromUser, toUser, 25, 'Servis ödemesi');

// İşlem geçmişi
const history = WaiqtionWallet.getTransactions(userId, 10);
```

## 🎨 UI Gösterimi

Header'da kullanıcının WQT bakiyesi görünür:
```
🪙 150 WQT
   Ahmet Y.
```

## 🔄 Gelecek Özellikler

- [ ] WQT liderboard (en çok kazananlar)
- [ ] Haftalık WQT yarışmaları
- [ ] Premium features (WQT ile)
- [ ] WQT hediye gönderme
- [ ] Günlük görevler (daily quests)
- [ ] Achievement sistemi

## ⚠️ Önemli Notlar

1. **Gerçek para değildir** - WQT'yi gerçek parayla satın alamaz veya satamazzısınız
2. **Platform içi değerdir** - Sadece VYNRYX'te kullanılır
3. **Reset edilebilir** - Platform admin tarafından sıfırlanabilir
4. **Kayıp riski** - LocalStorage temizlenirse kaybolur (backup önerilir)

---

**VYNRYX - Waiqtion ile Çalışan P2P Freelance Platform**
