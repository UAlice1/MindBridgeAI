# YourVoice 2.0 - Setup & Testing Guide

## 🚀 Quick Start

### Prerequisites
```bash
Node.js 18+ installed
npm 9+ installed
```

### Installation Steps

1. **Install Dependencies**
```bash
npm install
```

2. **Set Up Environment Variables**
Create a `.env` file in the root directory:

```env
# Groq API Key (for AI responses)
VITE_GROQ_API_KEY=your_groq_api_key_here

# Optional: OpenAI API Key (if you want to use OpenAI instead)
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

**Get Your Groq API Key:**
- Visit: https://console.groq.com
- Sign up for free account
- Navigate to API Keys section
- Create new key
- Copy and paste into `.env` file

3. **Run Development Server**
```bash
npm run dev
```

4. **Open in Browser**
```
http://localhost:5173
```

---

## 🧪 Testing the New Features

### 1. Test Anonymous Hash System

**Steps:**
1. Open the application
2. Look for "Your Anonymous ID" badge on home screen
3. Note the hash (format: `YV-XXXXXXXXXX`)
4. Refresh the page
5. ✅ **Expected:** Same hash appears (persisted in localStorage)

**Test Persistence:**
1. Start a conversation (any mode)
2. Close browser completely
3. Reopen application
4. ✅ **Expected:** Same hash is displayed

---

### 2. Test Text Chat Mode (Existing + Enhanced)

**Steps:**
1. On home screen, select **"Text Chat"** mode
2. Type a message like "I'm feeling stressed"
3. Press Enter
4. ✅ **Expected:** 
   - AI responds with supportive text
   - Conversation flows normally
   - Crisis detection works if needed

---

### 3. Test Voice Therapist Mode (NEW!)

**Steps:**
1. On home screen, select **"Voice Therapist"** mode
2. Click the input field or quick-start chip
3. ✅ **Expected:** Avatar chat screen opens

**Test Avatar Display:**
1. Observe the animated avatar
2. ✅ **Expected:**
   - Circular avatar with animated face
   - Eyes visible
   - Mouth in neutral position
   - Emotion label below avatar

**Test Voice Input:**
1. Click the large microphone button (green)
2. Allow microphone permissions if prompted
3. Speak clearly: "Hello, I need someone to talk to"
4. ✅ **Expected:**
   - Avatar shows "Listening..." status
   - Microphone indicator appears
   - Your speech is transcribed
   - Message sent to AI

**Test Voice Output:**
1. Wait for AI response
2. ✅ **Expected:**
   - Avatar mouth animates (opens/closes)
   - Audio plays with AI response
   - Status shows "Speaking..."
   - Emotion may change based on response
   - Transcript appears below avatar

**Test Mute Function:**
1. During AI speech, click the mute icon
2. ✅ **Expected:**
   - Audio stops
   - Avatar still animates
   - Text transcript continues

**Test Skip Function:**
1. While avatar is speaking, click skip button
2. ✅ **Expected:**
   - Audio stops immediately
   - Ready for next input

---

### 4. Test Crisis Detection (Both Modes)

**Text Mode:**
1. Send message: "I don't want to live anymore"
2. ✅ **Expected:**
   - Crisis alert banner appears (red/orange)
   - Emergency contacts displayed
   - Isange One Stop Center info shown
   - Option to submit confidential report

**Voice Mode:**
1. Speak: "Someone hurt me and I'm scared"
2. ✅ **Expected:**
   - Crisis alert appears above avatar
   - Avatar emotion changes to "concerned"
   - Emergency resources provided
   - Voice response acknowledges concern

---

### 5. Test NGO Recommendations

**Steps:**
1. Mention abuse or GBV: "I experienced domestic violence"
2. ✅ **Expected:**
   - Crisis alert shows
   - Isange centers listed with phone numbers
   - Police GBV unit (3512) displayed
   - Local NGOs recommended

**Check Recommendations:**
- Isange One Stop Center (CHUK)
- Caraes Ndera (mental health)
- Rwanda Police GBV Unit
- Province-specific resources

---

### 6. Test Language Switching

**Steps:**
1. On home screen, toggle between "English" and "Kinyarwanda"
2. Start conversation in each language
3. ✅ **Expected:**
   - UI changes to selected language
   - AI responds in same language
   - Avatar speaks in selected language
   - All labels/buttons translate

**Test Mixed Language:**
1. Set to English
2. Type in Kinyarwanda: "Mfite agahinda"
3. ✅ **Expected:** AI detects and responds in Kinyarwanda

---

### 7. Test Mode Switching

**Steps:**
1. Start conversation in Text mode
2. Click sidebar → "New Conversation"
3. Return to home screen
4. Select Voice Therapist mode
5. Start new conversation
6. ✅ **Expected:** Seamless transition between modes

---

### 8. Test Anonymous Hash in Sidebar

**Steps:**
1. Click menu icon (top left) or hamburger menu
2. Sidebar opens
3. ✅ **Expected:**
   - Anonymous ID card shows at top of sidebar
   - Same hash as home screen
   - Monospace font for readability

---

### 9. Test Browser Compatibility

**Test in Multiple Browsers:**
- ✅ Chrome (best support)
- ✅ Edge (full support)
- ✅ Safari (may need user gesture for TTS)
- ⚠️ Firefox (limited voice recognition)

**Check for Fallbacks:**
1. If voice not supported, verify error message shows
2. Text mode should always work

---

### 10. Test Conversation History (LocalStorage)

**Steps:**
1. Have a conversation (any mode)
2. Open Browser DevTools (F12)
3. Go to Application → Local Storage
4. Check for keys:
   - `yourvoice_anonymous_hash`
   - `yourvoice_conversations`
5. ✅ **Expected:** Data stored locally

---

## 🔍 Troubleshooting

### Avatar Not Speaking

**Problem:** Avatar animates but no sound

**Solutions:**
1. Check browser sound is not muted
2. Check OS sound settings
3. Try clicking avatar/screen first (browser policy)
4. Check browser console for errors
5. Try different browser

**Check TTS Availability:**
```javascript
// Open browser console and run:
console.log('TTS available:', 'speechSynthesis' in window)
console.log('Voices:', speechSynthesis.getVoices())
```

---

### Microphone Not Working

**Problem:** "Listening..." never starts

**Solutions:**
1. Check browser permissions: Settings → Privacy → Microphone
2. Allow microphone access when prompted
3. Check if other apps are using microphone
4. Try different browser
5. Verify HTTPS or localhost (required for mic access)

**Check Microphone Access:**
```javascript
// Open browser console and run:
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(() => console.log('Mic access granted'))
  .catch(err => console.error('Mic access denied:', err))
```

---

### API Errors

**Problem:** "API Key Required" error

**Solutions:**
1. Verify `.env` file exists in root directory
2. Check `VITE_GROQ_API_KEY=...` is set correctly
3. No spaces around `=` in `.env`
4. Restart dev server after changing `.env`
5. Check API key is valid on Groq console

**Problem:** "Too many requests" / Rate limit

**Solutions:**
1. Wait 1-2 minutes
2. Groq free tier has limits
3. Consider upgrading plan
4. Check you're not making rapid requests

---

### Avatar Not Animating

**Problem:** Static avatar, no mouth movement

**Solutions:**
1. Check if TTS is actually playing (listen for sound)
2. Verify browser console for React/Framer Motion errors
3. Clear browser cache
4. Restart dev server

---

### Hash Not Persisting

**Problem:** New hash on every refresh

**Solutions:**
1. Check localStorage is enabled in browser
2. Not in incognito/private mode
3. Check browser settings allow local storage
4. Clear cookies/storage and try again

---

## 📊 Testing Checklist

### Core Features
- [ ] Anonymous hash generates on first visit
- [ ] Hash persists across sessions
- [ ] Text chat mode works
- [ ] Voice therapist mode works
- [ ] Mode selection toggles correctly
- [ ] Language switching works (EN/RW)

### Avatar Features
- [ ] Avatar displays correctly
- [ ] Eyes animate when listening
- [ ] Mouth animates when speaking
- [ ] Emotion changes based on context
- [ ] Status indicators work (listening/speaking)
- [ ] Mute button functions
- [ ] Skip button works

### Voice Features
- [ ] Microphone captures speech
- [ ] Speech-to-text transcription works
- [ ] Text-to-speech plays responses
- [ ] Voice has appropriate emotion/tone
- [ ] Audio can be muted
- [ ] Falls back to text if unavailable

### Crisis Detection
- [ ] Crisis keywords detected
- [ ] Alert banner appears
- [ ] Emergency contacts displayed
- [ ] Isange centers shown
- [ ] Report option available
- [ ] Works in both modes

### UI/UX
- [ ] Home screen mode selector
- [ ] Anonymous ID badge visible
- [ ] Sidebar shows hash
- [ ] Smooth animations
- [ ] Responsive on mobile
- [ ] Accessible controls

### Data & Privacy
- [ ] No login required
- [ ] Data stored locally only
- [ ] Hash not linkable to identity
- [ ] Conversations private
- [ ] Can export data

---

## 🎯 Performance Testing

### Load Time
1. Measure initial page load
2. ✅ Target: < 3 seconds

### Avatar Responsiveness
1. Click microphone → Start speaking
2. ✅ Target: < 1 second to show "Listening"

### AI Response Time
1. Send message
2. ✅ Target: 2-5 seconds (depends on API)

### TTS Latency
1. AI responds → Audio starts
2. ✅ Target: < 500ms

---

## 🔧 Development Tips

### Hot Reload
- Save files to see changes instantly
- No need to refresh browser manually

### React DevTools
- Install React DevTools extension
- Inspect component state
- Debug prop changes

### Console Logging
- Check browser console for errors
- Look for TTS/speech recognition logs

### Testing Voice Locally
```javascript
// Quick TTS test in console:
const utterance = new SpeechSynthesisUtterance('Hello, testing voice')
speechSynthesis.speak(utterance)

// Quick speech recognition test:
const recognition = new webkitSpeechRecognition()
recognition.start()
recognition.onresult = (e) => console.log(e.results[0][0].transcript)
```

---

## 📱 Mobile Testing

### iOS Safari
- Tap to activate audio (browser policy)
- Voice recognition may need gesture
- TTS works well

### Android Chrome
- Best mobile experience
- Full voice support
- TTS and recognition work

### Responsive Layout
- Test portrait and landscape
- Check avatar sizing
- Verify controls are reachable

---

## 🎓 Demo Script

### For Presentations

**Introduction (1 min):**
> "Welcome to YourVoice, an AI-powered mental health platform serving young people in Rwanda."

**Show Anonymous System (30 sec):**
> "Notice the anonymous ID - no login required. Your privacy is protected."

**Demo Text Mode (1 min):**
> "Let me type 'I'm feeling stressed today'"
> [Show AI response and conversation flow]

**Demo Voice Mode (2 min):**
> "Now, let's try the voice therapist avatar."
> [Click voice mode, speak to avatar]
> "Watch how the avatar listens, processes, and responds with voice."

**Show Crisis Detection (1 min):**
> "If someone expresses crisis thoughts, the system immediately provides help."
> [Show crisis alert with Isange contacts]

**NGO Integration (1 min):**
> "The platform connects users with verified support organizations across Rwanda."
> [Show NGO list and Isange centers]

**Conclusion (30 sec):**
> "YourVoice combines AI accessibility with human professional support - making mental health care more accessible."

---

## 🐛 Known Issues & Workarounds

### Issue: Kinyarwanda TTS Falls Back to English
**Workaround:** Browser may not have Kinyarwanda voice installed. English voice still conveys the message.

### Issue: Safari Requires User Gesture for TTS
**Workaround:** Click anywhere on page before avatar speaks.

### Issue: Voice Recognition Stops After Short Silence
**Workaround:** This is expected behavior. Click microphone again to continue.

### Issue: Avatar Lip-Sync Not Perfect
**Workaround:** This is a timing approximation. Consider it artistic interpretation!

---

## 📞 Support

### Need Help?
- Check YOURVOICE_ENHANCEMENTS.md for detailed documentation
- Review browser console for error messages
- Verify API keys are set correctly
- Test in different browser

### Emergency Contacts in Rwanda
- Emergency Services: 112
- GBV Hotline: 3512
- Caraes Ndera: +250 788 386 200

---

**Ready to test? Run `npm run dev` and start exploring!** 🚀
