# YourVoice 2.0 - Enhancement Summary

## 🎯 Overview
Built on top of the existing MindBridgeAI platform with new features to match the YourVoice project proposal requirements.

---

## ✅ What Was Already Built
- Text-based AI chat with emotional support
- Crisis detection & NGO recommendations  
- Multilingual support (English & Kinyarwanda)
- Professional dashboard for case management
- Isange One Stop Center integration
- Basic voice input (browser speech recognition)

---

## 🆕 New Features Added

### 1. **🎭 AI Therapist Avatar Component**
**File:** `src/components/TherapistAvatar.tsx`

**Features:**
- Animated cartoon avatar with facial expressions
- Lip-sync animation when speaking
- Emotional states: neutral, happy, caring, concerned, hopeful
- Visual indicators for speaking and listening states
- Mute/unmute controls
- Glow effects during interaction

**How it works:**
- Avatar eyes blink when listening
- Mouth animates when speaking (opens/closes based on speech)
- Color changes based on emotional context
- Real-time visual feedback for user engagement

---

### 2. **🔐 Anonymous Hash-Based Authentication**
**File:** `src/service/anonymousAuth.ts`

**Features:**
- Generates unique anonymous hash IDs (format: `YV-XXXXXXXXXX`)
- No personal information required
- Persistent across sessions using localStorage
- Conversation history tracking per hash
- Data export functionality for privacy compliance
- Separate report IDs for NGO referrals

**Key Functions:**
```typescript
getOrCreateAnonymousUser() // Get or create hash
getCurrentAnonymousUser()   // Get current user
saveConversation()          // Save chat history
getUserConversations()      // Retrieve past chats
exportUserData()            // Export for privacy
generateReportId()          // Create report ID for NGO
```

---

### 3. **🎤 Text-to-Speech Service**
**File:** `src/service/textToSpeech.ts`

**Features:**
- Browser-based speech synthesis
- Emotional voice modulation:
  - **Caring**: Slower pace, slightly higher pitch
  - **Hopeful**: Uplifting tone  
  - **Concerned**: Slower, lower pitch
  - **Happy**: Faster, higher pitch
  - **Neutral**: Normal pace
- Multi-language support (English & Kinyarwanda)
- Long-text chunking for better performance
- Automatic emotion detection from AI responses
- Play/pause/stop controls

**Voice Parameters:**
- Rate: 0.8 - 1.05 (depending on emotion)
- Pitch: 0.95 - 1.2 (depending on emotion)
- Volume: Adjustable
- Prefers female voices for warmer tone

---

### 4. **👤 Avatar Chat Screen**
**File:** `src/components/AvatarChatScreen.tsx`

**Features:**
- Full voice-based therapy session
- Interactive avatar that speaks responses
- Voice input via microphone
- Automatic speech-to-text transcription
- Text-to-speech for AI responses
- Visual conversation transcript
- Crisis detection with voice alerts
- Skip speech functionality
- Mute controls

**User Experience:**
1. User taps microphone to speak
2. Avatar listens (visual indicator)
3. Speech transcribed to text
4. AI processes and responds
5. Avatar speaks response with matching emotion
6. Conversation transcript shown below

---

### 5. **🎚️ Dual Chat Mode Selection**
**Updated:** `src/App.tsx`, `src/components/HomeScreen.tsx`

**Features:**
- **Text Chat Mode**: Original text-based conversation
- **Voice Therapist Mode**: Avatar-based voice interaction
- Mode selector on home screen
- Seamless switching between modes
- Both modes share same AI backend
- Anonymous hash persists across both modes

**UI Elements:**
- Two prominent mode selection cards
- Icons: Message bubble (text) & Microphone (voice)
- Clear visual distinction
- Selected mode highlighted

---

### 6. **🆔 Anonymous Hash Display**
**Updated:** `src/components/HomeScreen.tsx`, `src/components/Sidebar.tsx`

**Features:**
- Hash ID displayed prominently on home screen
- Also shown in sidebar for easy reference
- Monospace font for readability
- Lock icon for security visual
- Instructions to save ID for returning users
- Bilingual labels (English & Kinyarwanda)

---

## 🎨 User Interface Enhancements

### Home Screen
- Mode selector with two options (Text / Voice)
- Anonymous ID badge with save instructions
- Updated quick-start chips work with selected mode
- Cleaner layout with mode-aware interactions

### Avatar Chat Screen
- Large animated avatar (220px)
- Voice controls (mic button, mute, skip)
- Scrollable conversation transcript
- Crisis alerts integrated
- Real-time status indicators

### Sidebar
- Anonymous hash ID card at top
- Persistent across all screens
- Easy to copy/save

---

## 🔧 Technical Implementation

### Technologies Used
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Chakra UI** - Component library
- **Framer Motion** - Animations
- **Web Speech API** - Voice recognition
- **Speech Synthesis API** - Text-to-speech
- **LocalStorage** - Anonymous user persistence
- **Groq API** - AI responses (existing)

### Browser Compatibility
- **Text-to-Speech**: Chrome, Edge, Safari, Firefox
- **Speech Recognition**: Chrome, Edge, Safari (requires webkit prefix)
- **Fallback**: Text mode always available

---

## 📋 Project Structure

```
src/
├── components/
│   ├── TherapistAvatar.tsx      ← NEW: Animated avatar component
│   ├── AvatarChatScreen.tsx     ← NEW: Voice chat interface
│   ├── HomeScreen.tsx            ← UPDATED: Mode selection
│   ├── Sidebar.tsx               ← UPDATED: Hash display
│   ├── ChatScreen.tsx            ← EXISTING: Text chat
│   └── ...
├── service/
│   ├── anonymousAuth.ts          ← NEW: Hash auth system
│   ├── textToSpeech.ts           ← NEW: TTS service
│   ├── groq.ts                   ← EXISTING: AI backend
│   └── ...
└── App.tsx                        ← UPDATED: Dual mode routing
```

---

## 🚀 How to Use

### For Users

**Starting a Session:**
1. Open YourVoice platform
2. Note your Anonymous ID (save it!)
3. Choose support method:
   - **Text Chat**: Type your feelings
   - **Voice Therapist**: Speak with avatar

**Text Chat Mode:**
1. Type message in input box
2. Press Enter to send
3. AI responds with text
4. Continue conversation

**Voice Therapist Mode:**
1. Tap microphone button
2. Speak your feelings
3. Avatar listens and transcribes
4. Avatar responds with voice
5. Watch avatar's expressions
6. Tap again to speak more

**Muting Audio:**
- Click volume icon to mute avatar's voice
- Avatar still provides text responses
- Useful in public spaces

---

## 🔐 Privacy & Security

### Anonymous System
- No login required
- No personal data collected
- Hash IDs are locally generated
- Not linkable to real identity
- Conversations stored locally only

### Data Storage
- LocalStorage (client-side only)
- No server-side user tracking
- Conversations kept for 50 sessions max
- User can export data anytime
- Clear data option available

### NGO Referrals
- Separate report IDs generated
- Not linked to user hash
- One-time use codes
- Professional access only

---

## 🌍 NGO & Isange Integration

### How It Works
1. User expresses crisis/abuse situation
2. AI detects severity and type
3. Crisis alert appears with recommendations
4. User can request confidential report
5. Report includes recommended NGOs:
   - **Isange One Stop Centers** (GBV cases)
   - **Caraes Ndera** (Mental health crisis)
   - **Rwanda Police GBV Unit** (Abuse reporting)
   - **Local NGOs** (Based on province)

### Report System
- Anonymous report ID generated
- User hash NOT included in report
- NGO contact details provided
- 24/7 emergency numbers listed
- Province-based routing

---

## 🎯 Alignment with Project Proposal

| Proposal Requirement | Implementation | Status |
|---------------------|----------------|--------|
| Anonymous registration | Hash-based IDs | ✅ Done |
| AI text chat | ChatScreen.tsx | ✅ Existing |
| AI voice therapist | AvatarChatScreen.tsx | ✅ Done |
| Animated avatar | TherapistAvatar.tsx | ✅ Done |
| Voice interaction | TTS + Speech Recognition | ✅ Done |
| NGO partnerships | NGO database + routing | ✅ Existing |
| Isange integration | Crisis routing | ✅ Existing |
| GBV reporting | SubmissionReport.tsx | ✅ Existing |
| Professional dashboard | ProfessionalDashboard.tsx | ✅ Existing |
| Multilingual (EN/RW) | All components | ✅ Existing |

---

## 🐛 Known Limitations

### Browser Support
- Voice features require modern browsers
- Safari may need user gesture to start TTS
- Firefox voice recognition limited

### TTS Quality
- Kinyarwanda voice may fall back to English
- Quality depends on OS/browser voices
- Some accents may sound unnatural

### Storage Limits
- LocalStorage has ~5-10MB limit
- Conversation history capped at 50 sessions
- Large sessions may be truncated

---

## 🔮 Future Enhancements

### Potential Additions
1. **Avatar Customization**
   - Different avatar styles
   - User-selectable appearances
   - Cultural customization

2. **Enhanced Voice**
   - Better Kinyarwanda TTS
   - Custom voice models
   - Emotion detection from user voice

3. **Conversation Management**
   - Search past conversations
   - Export specific sessions
   - Tag important messages

4. **Professional Features**
   - Direct referral links
   - Case management integration
   - Follow-up scheduling

5. **Analytics Dashboard**
   - Emotion trends over time
   - Crisis frequency tracking
   - Support effectiveness metrics

---

## 📞 Support Contacts

### Emergency Services
- **Rwanda Emergency**: 112
- **GBV Hotline**: 3512
- **Caraes Ndera Hospital**: +250 788 386 200

### Isange One Stop Centers
- **CHUK (Kigali)**: +250 788 386 200
- **Kacyiru**: +250 788 311 811
- **Regional centers available nationwide**

---

## 👥 Credits

**Development Team:**
- Alice UMUBYEYI
- Pacifique NIYOMUGABO

**Built with:**
- React, TypeScript, Chakra UI
- Framer Motion, OpenAI SDK
- Groq API, Web Speech APIs

**Purpose:**
Mental health awareness and accessible support for young people in Rwanda.

---

## 📄 License

Built with care for mental wellness in Rwanda and beyond.  
© 2025 YourVoice AI. All rights reserved.

---

**Remember: This platform complements, not replaces, professional mental health services.**
