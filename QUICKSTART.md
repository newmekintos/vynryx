# ⚡ VYNRYX Hızlı Başlangıç

## 🚀 3 Adımda Başla!

### 1️⃣ Node.js Kurulumu Kontrolü

```bash
node --version
```

Eğer kurulu değilse:
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2️⃣ Projeyi Başlat

```bash
cd /home/mek/Desktop/VYNRYX
npm install
npm run dev
```

### 3️⃣ Tarayıcıda Aç

http://localhost:3000

---

## 🎯 İlk Kullanım

1. **MetaMask Kur**: https://metamask.io (eğer yoksa)
2. **"Connect Wallet"** butonuna tıkla
3. **Freelancer veya Client** seç
4. **Profilini oluştur**
5. **Diğer kullanıcıları keşfet ve chat yap!**

---

## 📱 Mobil Test

Aynı WiFi ağında başka bir cihazdan:

```
http://[BILGISAYAR-IP-ADRESI]:3000
```

IP adresinizi bulmak için:
```bash
# Linux
hostname -I

# macOS
ipconfig getifaddr en0
```

---

## 🔥 Özellikler

✅ %100 P2P - Merkezi sunucu yok
✅ Wallet ile kimlik doğrulama
✅ Gerçek zamanlı chat
✅ Profil keşfetme
✅ Offline-first PWA

---

## ⚠️ Önemli!

- MetaMask **zorunlu** - platform wallet olmadan çalışmaz
- İlk peer bağlantısı 5-10 saniye sürebilir
- Tüm veriler **local** - tarayıcı temizlenirse kaybolur
- Ödeme/escrow yok - direkt anlaşma yapın

---

## 🐛 Sorun mu var?

```bash
# Port değiştir
npm run dev -- -p 3001

# Cache temizle
rm -rf .next
npm run dev

# Dependencies yeniden yükle
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Daha Fazla Bilgi

- **README.md**: Detaylı dökümantasyon
- **PROJECT_SUMMARY.md**: Teknik detaylar
- **INSTALLATION.md**: Kurulum rehberi

---

**VYNRYX'e hoş geldiniz! 🎉**

*Sorular için GitHub Issues kullanın.*
