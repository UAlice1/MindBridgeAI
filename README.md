# YourVoice AI - Mental Health Support Platform

> **An AI-powered mental health and gender-based violence support platform providing confidential guidance, crisis intervention, and NGO case management for communities in Rwanda and beyond.**

[![React](https://img.shields.io/badge/React-19.2-blue?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue?logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8.0-purple?logo=vite)](https://vitejs.dev)

---

## 🆕 **NEW in Version 2.0!**

### **🎭 AI Therapist Avatar**
Interactive animated avatar with voice interaction, emotional expressions, and lip-sync animations.

### **🔐 Anonymous Hash System**
Secure, anonymous user identification without requiring login or personal information.

### **🎤 Dual Support Modes**
- **Text Chat**: Traditional text-based AI conversation
- **Voice Therapist**: Interactive voice conversation with animated avatar

**[→ See Full Enhancement Details](./YOURVOICE_ENHANCEMENTS.md)**

---

##  Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Privacy & Security](#privacy--security)
- [Contributing](#contributing)
- [Support](#support)
- [License](#license)

---

##  Overview

YourVoice AI is a comprehensive digital mental health platform designed specifically for young people in Rwanda. It combines:

- **AI-Powered Support**: Immediate emotional guidance and crisis intervention
- **Human Connection**: Direct referrals to trained professionals and NGOs
- **Voice Interaction**: Natural conversation with an empathetic AI therapist avatar
- **Anonymous Access**: No login required, complete privacy protection
- **Cultural Sensitivity**: Bilingual support (English & Kinyarwanda)
- **24/7 Availability**: Always accessible when you need help

The platform operates in two main modes:

1. **User Mode:** Anonymous AI chat system (text or voice) providing emotional support
2. **Professional Mode:** Case management dashboard for NGOs and healthcare providers

---

## Key Features

### 🎭 For Users

#### **Text Chat Mode**
- Real-time AI conversation
- Emotion detection and analysis
- Crisis keyword monitoring
- Multilingual support (EN/RW)
- Quick-start prompts

#### **Voice Therapist Mode** (NEW!)
- Animated AI therapist avatar
- Voice-to-voice conversation
- Emotional facial expressions
- Natural lip-sync animation
- Mute and skip controls
- Conversation transcript

#### **Crisis Support**
- Automatic crisis detection
- Emergency contact display
- Isange One Stop Center integration
- NGO referral system
- 24/7 helpline numbers

#### **Privacy Features**
- Anonymous hash-based ID
- No personal data collection
- Local-only conversation storage
- No account required
- Data export capability

### 👨‍⚕️ For Professionals

- **Case Management Dashboard**
- **Risk Level Classification**
- **Analytics and Reporting**
- **Case Search and Filtering**
- **Status Updates and Notes**
- **Notification System**

---

## Quick Start

### Prerequisites
- Node.js 18+
- npm 9+
- Modern browser (Chrome, Edge, Safari, Firefox)

### Installation

```bash
# Clone repository
git clone https://github.com/your-org/yourvoice-ai.git
cd yourvoice-ai

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Add your Groq API key to .env
# VITE_GROQ_API_KEY=your_key_here

# Start development server
npm run dev
```

**Get Free Groq API Key:** https://console.groq.com

### First Run

1. Open http://localhost:5173
2. Note your Anonymous ID on home screen
3. Choose Text Chat or Voice Therapist mode
4. Start your conversation!

**[→ Detailed Setup Guide](./SETUP_GUIDE.md)**

---

## Documentation

### For Developers
- **[Enhancement Details](./YOURVOICE_ENHANCEMENTS.md)** - New features and technical implementation
- **[Setup & Testing Guide](./SETUP_GUIDE.md)** - Installation, testing, and troubleshooting
- **[Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)** - Production deployment guide

### For Users
- **[User Guide](#usage)** - How to use the platform
- **[Privacy Policy](#privacy--security)** - Data handling and security

### For Partners
- **[NGO Integration](#ngo-integration)** - Partnership details
- **[Professional Dashboard](#professional-mode)** - Case management guide

---

##  Technology Stack

### Frontend
- **React 19** - UI framework
- **TypeScript 6** - Type safety
- **Vite 8** - Build tool
- **Chakra UI 3** - Component library
- **Framer Motion 12** - Animations

### AI & Backend
- **Groq API** - Fast LLM inference (Llama 3.3 70B)
- **OpenAI SDK** - API client
- **Web Speech API** - Voice recognition
- **Speech Synthesis API** - Text-to-speech

### Storage
- **LocalStorage** - Anonymous user data
- **Client-side only** - No backend server required

---

## Project Structure

```
yourvoice-ai/
├── src/
│   ├── components/
│   │   ├── TherapistAvatar.tsx      ← NEW: Animated avatar
│   │   ├── AvatarChatScreen.tsx     ← NEW: Voice chat interface
│   │   ├── ChatScreen.tsx           ← Text chat
│   │   ├── HomeScreen.tsx           ← Landing page
│   │   ├── Sidebar.tsx              ← Navigation
│   │   ├── CrisisAlert.tsx          ← Emergency alerts
│   │   ├── ProfessionalDashboard.tsx ← NGO dashboard
│   │   └── ...
│   ├── service/
│   │   ├── anonymousAuth.ts         ← NEW: Hash system
│   │   ├── textToSpeech.ts          ← NEW: TTS service
│   │   ├── groq.ts                  ← AI backend
│   │   ├── riskDetection.ts         ← Crisis detection
│   │   └── caseManager.ts           ← Case management
│   ├── data/
│   │   └── ngos.ts                  ← NGO database
│   ├── types/
│   │   └── index.ts                 ← TypeScript types
│   ├── App.tsx                       ← Main app component
│   └── main.tsx                      ← Entry point
├── public/                           ← Static assets
├── docs/
│   ├── YOURVOICE_ENHANCEMENTS.md    ← Feature documentation
│   ├── SETUP_GUIDE.md               ← Setup instructions
│   └── DEPLOYMENT_CHECKLIST.md      ← Deployment guide
├── .env.example                      ← Environment template
├── package.json                      ← Dependencies
├── vite.config.ts                    ← Build config
└── README.md                         ← This file
```

---

## Usage

### User Mode

#### **Starting a Session**
1. Open the YourVoice platform
2. Your Anonymous ID is displayed (save it!)
3. Choose your support method:
   - **Text Chat** - Type your feelings
   - **Voice Therapist** - Speak with avatar

#### **Text Chat Mode**
1. Type your message in the input box
2. Press Enter or click Send
3. AI responds with supportive guidance
4. Continue the conversation naturally

#### **Voice Therapist Mode**
1. Click the microphone button
2. Speak your feelings clearly
3. Avatar listens and transcribes
4. Avatar responds with voice and animation
5. Watch emotional expressions
6. Click mic again to continue

#### **During Crisis**
- Crisis keywords automatically detected
- Emergency alert banner appears
- Isange One Stop Centers displayed
- Professional hotlines provided
- Option to submit confidential report

### Professional Mode

#### **Accessing Dashboard**
1. Click "Professional Dashboard" button
2. Enter professional credentials
3. View case queue and notifications
4. Manage and respond to cases
5. Update case status and notes

#### **Case Management**
- View all submitted cases
- Filter by risk level, type, status
- Accept and assign cases
- Add professional notes
- Refer to appropriate NGOs
- Track case resolution

---

## NGO Integration

### Partner Organizations

**Isange One Stop Centers:**
- CHUK (Kigali): +250 788 386 200
- Kacyiru: +250 788 311 811
- Butare, Ruhengeri, Kibungo, Kibuye

**Mental Health:**
- Caraes Ndera Neuropsychiatric Hospital
- +250 788 386 200

**Law Enforcement:**
- Rwanda Police GBV Unit: 3512
- Emergency Services: 112

**Community NGOs:**
- HAGURUKA (Women & Children Rights)
- RWAMREC (Men's Resource Centre)
- Province-specific organizations

### Referral Process

1. User expresses crisis/abuse situation
2. AI detects severity and type
3. System recommends appropriate NGOs
4. User can generate confidential report
5. Report includes anonymous report ID
6. NGO receives case details (no user identity)
7. Professional follow-up coordinated

---

## Privacy & Security

### Data Handling

**What We Store:**
- Anonymous hash ID (locally)
- Conversation history (locally)
- Selected preferences (locally)

**What We DON'T Store:**
- Real names or identities
- Contact information
- Location data
- IP addresses
- Any personally identifiable information

### Security Measures

- **No Backend**: All data stays on user's device
- **Local Storage**: Conversations never sent to servers
- **Anonymous Hashes**: Not linkable to real identity
- **Encrypted API Calls**: HTTPS only
- **No Tracking**: No analytics on personal data

### User Rights

- Export your data anytime
- Delete your data anytime
- Anonymous access always available
- No registration required

**[→ Full Privacy Policy](./PRIVACY.md)**

---

## Architecture

### System Flow

```
User
  ↓
[Home Screen] → Select Mode → [Text Chat] OR [Voice Chat]
  ↓                              ↓              ↓
[Anonymous Hash Generated]    [AI Backend] [Avatar + TTS]
  ↓                              ↓              ↓
[Conversation Started]       [Response]    [Voice Response]
  ↓                              ↓              ↓
[Crisis Detection?] ────────→ [Alert] → [NGO Referral]
  ↓
[Case Report] → [Professional Dashboard] → [NGO Action]
```

### Component Hierarchy

```
App
├── HomeScreen
│   ├── Mode Selector (Text / Voice)
│   ├── Anonymous ID Badge
│   └── Quick Start Chips
├── ChatScreen (Text Mode)
│   ├── ChatHeader
│   ├── Message List
│   ├── ChatInput
│   └── CrisisAlert (if triggered)
├── AvatarChatScreen (Voice Mode)
│   ├── TherapistAvatar
│   ├── Voice Controls
│   ├── Conversation Transcript
│   └── CrisisAlert (if triggered)
├── ProfessionalDashboard
│   ├── Case Queue
│   ├── Case Details
│   └── Analytics
└── Sidebar
    ├── Navigation
    └── Anonymous ID Display
```

---

## Contributing

We welcome contributions from developers, mental health professionals, and community members!

### Development Setup

```bash
# Fork and clone
git clone https://github.com/your-username/yourvoice-ai.git

# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and test
npm run dev
npm run build

# Commit and push
git add .
git commit -m "feat: your feature description"
git push origin feature/your-feature-name

# Open pull request
```

### Contribution Guidelines

- Follow existing code style
- Add TypeScript types for new code
- Test on multiple browsers
- Update documentation
- Respect user privacy principles
- Consider cultural sensitivity

### Areas for Contribution

- Translations (more languages)
- Crisis keyword expansion
- NGO database updates
- Accessibility improvements
- Performance optimizations
- Documentation enhancements

---

## Impact

### Our Goals

**Increase Access**
- Mental health support 24/7
- No barriers (cost, login, stigma)
- Available in local languages

**Reduce Stigma**
- Anonymous, judgment-free space
- Private conversations
- Normalize help-seeking

**Save Lives**
- Early crisis intervention
- Immediate emergency contacts
- Professional referral pathways

**Support Ecosystem**
- Strengthen NGO response
- Empower healthcare workers
- Build community resilience

### Success Metrics

- Conversations facilitated
- Crisis interventions
- Professional referrals
- User satisfaction
- Lives positively impacted

---

## Support

### For Users

**Need help using the platform?**
- Read the [Setup Guide](./SETUP_GUIDE.md)
- Check common issues below
- Contact support email (if available)

**In Crisis Right Now?**
- **Rwanda Emergency**: 112
- **GBV Hotline**: 3512
- **Caraes Ndera**: +250 788 386 200
- **Isange CHUK**: +250 788 386 200

### For Developers

**Technical Issues?**
- Check [Setup Guide](./SETUP_GUIDE.md) troubleshooting
- Review browser console errors
- Verify API keys are set
- Test in different browser

**Want to Contribute?**
- Read contribution guidelines above
- Open an issue for discussion
- Submit pull requests

### For Partners

**NGO Partnership:**
- Contact project leads
- Review partnership requirements
- Complete integration process

---

## Acknowledgments

**Development Team:**
- Alice UMUBYEYI
- Pacifique NIYOMUGABO

**Partners:**
- Isange One Stop Centers
- Caraes Ndera Neuropsychiatric Hospital
- Rwanda National Police
- Mental health NGOs across Rwanda

**Technology:**
- Groq (AI infrastructure)
- Open source community
- Web standards contributors

---

## License

**MIT License**

Copyright (c) 2025 YourVoice AI

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---

## Important Notice

**This platform is designed to complement, NOT replace, professional mental health services.**

- Always seek professional help for serious mental health concerns
- In emergency situations, contact local emergency services
- YourVoice AI provides supportive guidance, not medical advice
- Confidential professional counseling is always recommended

---

##  Links

- **Documentation**: [YOURVOICE_ENHANCEMENTS.md](./YOURVOICE_ENHANCEMENTS.md)
- **Setup Guide**: [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- **Deployment**: [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
- **Project Proposal**: [YourVoice_Project_Proposal.pdf](./YourVoice_Project_Proposal.pdf)

---

**Built with ❤️ for mental health awareness in Rwanda and beyond.**

**You are not alone. 💚**

---
