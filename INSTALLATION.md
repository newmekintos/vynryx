# 🚀 VYNRYX Kurulum Rehberi

## Gereksinimler

1. **Node.js 18+** ve npm kurulu olmalı
2. **MetaMask** browser extension
3. Modern web browser (Chrome, Firefox, Brave, etc.)

## Kurulum Adımları

### 1. Node.js Kurulumu

Eğer Node.js kurulu değilse:

**Ubuntu/Debian:**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Diğer sistemler:**
https://nodejs.org/ adresinden indirebilirsiniz.

### 2. Bağımlılıkları Yükleyin

```bash
cd /home/mek/Desktop/VYNRYX
npm install
```

### 3. Geliştirme Sunucusunu Başlatın

```bash
npm run dev
```

Tarayıcınızda açın: http://localhost:3000

### 4. MetaMask Kurulumu

1. MetaMask browser extension'ı yükleyin: https://metamask.io/
2. Bir cüzdan oluşturun veya mevcut cüzdanınızı import edin
3. VYNRYX'i açın ve "Connect Wallet" butonuna tıklayın

## 🎯 İlk Kullanım

1. **Connect Wallet**: MetaMask ile bağlanın
2. **Choose Role**: Freelancer veya Client seçin
3. **Create Profile**: Profilinizi oluşturun
4. **Start Connecting**: Diğer kullanıcılarla bağlantı kurmaya başlayın!

## 🔧 Production Build

```bash
# Build
npm run build

# Start production server
npm start
```

## 📱 PWA Kurulumu (Mobil)

1. VYNRYX'i mobil tarayıcınızda açın
2. Browser menüsünden "Add to Home Screen" seçin
3. Artık VYNRYX bir mobil app gibi çalışacak!

## ⚠️ Önemli Notlar

- **P2P Network**: İlk açılışta birkaç peer bağlanması birkaç saniye sürebilir
- **Data Storage**: Tüm veriler browser'ınızda local olarak saklanır
- **Backup**: Önemli sohbetlerinizi kaydetmeyi unutmayın
- **Privacy**: Wallet adresiniz kimliğinizdir - gizli tutun

## 🐛 Sorun Giderme

### Port 3000 kullanımda hatası
```bash
# Farklı port kullanın
npm run dev -- -p 3001
```

### MetaMask bağlanmıyor
- Browser'ı yenileyin
- MetaMask extension'ı yeniden yükleyin
- Private/Incognito modda değilsiniz emin olun

### Peers göremiyorum
- Internet bağlantınızı kontrol edin
- Birkaç dakika bekleyin (ağ oluşması zaman alabilir)
- Browser console'da hata var mı kontrol edin

## 📞 Destek

Sorun yaşarsanız:
- GitHub Issues açın
- README.md dosyasını okuyun
- Community Discord'a katılın

---

**VYNRYX ekibine hoş geldiniz! 🎉**
