# YourVoice AI - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install (1 minute)

```bash
cd MindBridgeAI
npm install
```

### Step 2: Configure API Key (2 minutes)

1. **Get Free Groq API Key:**
   - Visit: https://console.groq.com
   - Sign up (free)
   - Go to API Keys section
   - Create new key
   - Copy the key

2. **Create `.env` file:**
   ```bash
   # Windows
   copy .env.example .env
   
   # Mac/Linux
   cp .env.example .env
   ```

3. **Add your key to `.env`:**
   ```env
   VITE_GROQ_API_KEY=gsk_your_actual_key_here
   ```

### Step 3: Run (1 minute)

```bash
npm run dev
```

### Step 4: Open Browser (30 seconds)

```
http://localhost:5173
```

### Step 5: Try It Out! (30 seconds)

1. **See your Anonymous ID** (it's displayed on home screen)
2. **Choose a mode:**
   - Click "Text Chat" for typing
   - Click "Voice Therapist" for speaking
3. **Start talking!**

---

## 🎭 What to Try First

### Text Chat Mode
1. Click "I'm feeling stressed and anxious"
2. Have a conversation with the AI
3. Notice how it responds empathetically

### Voice Therapist Mode
1. Click microphone button
2. Allow microphone access
3. Say: "Hello, I need someone to talk to"
4. Watch the avatar animate and respond!

---

## 🆘 Crisis Testing

Try saying/typing:
- "I'm feeling hopeless" → Should trigger support resources
- "Someone hurt me" → Should show Isange centers
- "I need emergency help" → Should display 112, 3512 numbers

---

## 🐛 Quick Fixes

### "API Key Required" Error
- Check `.env` file exists
- Verify `VITE_GROQ_API_KEY=...` is set
- Restart dev server (`Ctrl+C` then `npm run dev`)

### Avatar Not Speaking
- Check computer volume
- Click on page first (browser policy)
- Try Chrome or Edge browser

### Microphone Not Working
- Allow microphone permission when prompted
- Check browser settings → Privacy → Microphone
- Must be on `localhost` or `https://` domain

---

## 📚 Next Steps

- Read [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed testing
- Check [YOURVOICE_ENHANCEMENTS.md](./YOURVOICE_ENHANCEMENTS.md) for features
- Review [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) for production

---

## 🎉 You're All Set!

The platform is now running and ready to help people in Rwanda.

**Remember:** This saves lives. Test thoroughly, deploy carefully, and always keep emergency contacts updated.

---

**Need help?** Check the troubleshooting section in SETUP_GUIDE.md
