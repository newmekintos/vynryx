# VYNRYX 🚀

**Verify Your Network, Realize Your eXpertise**

Fully decentralized, peer-to-peer freelance platform built on Web3. **Waiqtion (WQT)** platform içi token sistemi ile çalışır. No central servers, no intermediaries - just direct connections between freelancers and clients.

![VYNRYX](https://img.shields.io/badge/Web3-P2P-purple?style=for-the-badge)
![Waiqtion](https://img.shields.io/badge/Token-WQT-yellow?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

## 🪙 Waiqtion (WQT) Token

VYNRYX, **Waiqtion (WQT)** adında kendi platform içi token sistemini kullanır:
- ✅ **100 WQT Hoş Geldin Bonusu** - Yeni kullanıcılara
- ✅ **Günlük Giriş Bonusu** - Her gün 5 WQT
- ✅ **Aktivite Kazancı** - İş tamamla, servis sat, WQT kazan
- ✅ **Platform Özellikleri** - İlan yayınla, servisleri öne çıkar
- ⚠️ **Platform İçi Kullanım** - Sadece VYNRYX'te geçerli

Detaylı bilgi için: [WAIQTION_INFO.md](./WAIQTION_INFO.md)

## 🌟 Features

### Core Features
- **100% Decentralized**: No central servers - your phone/browser acts as a node
- **P2P Networking**: Direct peer-to-peer connections using Gun.js
- **Wallet Authentication**: MetaMask integration for secure identity
- **Real-time Chat**: Direct messaging between freelancers and clients
- **Profile Discovery**: Find and connect with peers on the network
- **Offline-First**: PWA support for offline functionality
- **Zero Fees**: No platform fees - negotiate directly with peers

### Platform Features
- **Landing Page**: Professional welcome page with features showcase
- **Job Postings**: Clients can post jobs, freelancers can browse and bid
- **Service Marketplace**: Freelancers list services with pricing
- **Unified Auth**: Single page for login/register with wallet
- **Dashboard**: Separate views for freelancers and clients
- **Category Filters**: Browse by skill categories
- **Search**: Find jobs/services by keywords and tags

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **Lucide Icons** - Beautiful icons

### P2P & Web3
- **Gun.js** - Decentralized database and real-time sync
- **Ethers.js** - Web3 wallet integration
- **MetaMask** - Wallet authentication

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- MetaMask browser extension
- Modern web browser with Web3 support

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 How It Works

### 1. Connect Wallet
Click "Connect Wallet" and approve the MetaMask connection.

### 2. Choose Your Role
Select whether you're a **Freelancer** or a **Client**.

### 3. Create Profile
Fill in your profile information:
- **Freelancers**: Name, title, skills, bio
- **Clients**: Name, company/role, bio

### 4. Discover & Connect
Browse profiles on the P2P network and start chatting directly with potential collaborators.

### 5. Negotiate & Work
All communication happens peer-to-peer. Negotiate terms, agree on payment, and start working - all without platform intervention.

## 🔒 Security & Privacy

- **No Central Database**: All data is stored locally and synced P2P
- **Wallet-Based Identity**: Your Ethereum address is your unique ID
- **Encrypted Communication**: All P2P connections are encrypted
- **Self-Sovereign**: You own and control your data

## 🏗️ Architecture

```
┌─────────────────┐
│   Browser A     │
│  (Your Device)  │
└────────┬────────┘
         │
    Gun.js P2P
         │
┌────────┴────────┐
│   Gun Relay     │ (Bootstrap only)
│    Servers      │
└────────┬────────┘
         │
    Gun.js P2P
         │
┌────────┴────────┐
│   Browser B     │
│ (Peer's Device) │
└─────────────────┘
```

## 🌐 Network Bootstrap

VYNRYX uses public Gun.js relay servers for initial peer discovery:
- `https://gun-manhattan.herokuapp.com/gun`
- `https://peer.wallie.io/gun`

After initial connection, peers communicate directly without relay servers.

## 📱 PWA Support

VYNRYX is a Progressive Web App:
- Install on mobile devices
- Offline-first functionality
- Background sync when online

## 🛣️ Roadmap

### Phase 1: Core (Current) ✅
- [x] Wallet authentication
- [x] Profile creation
- [x] P2P profile discovery
- [x] Real-time P2P chat

### Phase 2: Enhanced Features
- [ ] File sharing (IPFS integration)
- [ ] Reputation system
- [ ] Project proposals
- [ ] Skill verification

### Phase 3: Smart Contracts
- [ ] Escrow contracts
- [ ] Milestone-based payments
- [ ] Dispute resolution
- [ ] On-chain reputation

### Phase 4: Full Decentralization
- [ ] Remove relay servers
- [ ] WebRTC direct connections
- [ ] DHT-based discovery
- [ ] Mobile apps

## 🤝 Contributing

Contributions are welcome! This is an open-source Web3 project.

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- [Gun.js](https://gun.eco/) - Decentralized database
- [Ethers.js](https://docs.ethers.org/) - Ethereum library
- [Next.js](https://nextjs.org/) - React framework
- [TailwindCSS](https://tailwindcss.com/) - Styling

---

**Built with ❤️ for the decentralized future**

*VYNRYX - Where Talent Meets Trust on Chain*
