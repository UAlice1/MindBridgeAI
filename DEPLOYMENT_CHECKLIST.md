# YourVoice 2.0 - Deployment Checklist

## ✅ Pre-Deployment Verification

### Code Quality
- [ ] All TypeScript errors resolved
- [ ] No console errors in browser
- [ ] All components render correctly
- [ ] Responsive design tested (mobile, tablet, desktop)
- [ ] Browser compatibility verified (Chrome, Safari, Firefox, Edge)

### Features Working
- [ ] Anonymous hash generation and persistence
- [ ] Text chat mode functional
- [ ] Voice therapist avatar mode functional
- [ ] Crisis detection working
- [ ] NGO recommendations accurate
- [ ] Language switching (EN/RW) works
- [ ] Mode selection (text/voice) works
- [ ] TTS (text-to-speech) functional
- [ ] Speech recognition functional
- [ ] Mute/unmute controls work
- [ ] Skip speech function works

### Content & Data
- [ ] NGO contact information verified and current
- [ ] Isange One Stop Center details correct
- [ ] Emergency numbers accurate (112, 3512)
- [ ] Crisis keywords comprehensive
- [ ] Translations reviewed (English & Kinyarwanda)
- [ ] AI prompts culturally appropriate

### Security & Privacy
- [ ] No personal data collection verified
- [ ] LocalStorage implementation secure
- [ ] No sensitive data in console logs
- [ ] API keys not exposed in client code
- [ ] HTTPS enforced (for production)
- [ ] No tracking scripts added

---

## 🚀 Deployment Steps

### 1. Environment Setup

**Create Production .env File:**
```bash
# .env.production
VITE_GROQ_API_KEY=your_production_api_key
```

**Security Notes:**
- Use environment variables in deployment platform
- Never commit `.env` to repository
- Rotate API keys regularly
- Monitor API usage

### 2. Build for Production

```bash
# Install dependencies
npm install

# Run production build
npm run build

# Output will be in /dist directory
```

**Verify Build:**
```bash
# Preview production build locally
npm run preview
```

### 3. Deployment Platforms

#### Option A: Vercel (Recommended)

**Steps:**
1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel --prod
```

3. Add environment variables in Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add `VITE_GROQ_API_KEY`

4. Redeploy after adding env vars

**Custom Domain:**
- Add custom domain in Vercel dashboard
- Configure DNS records as instructed
- SSL certificate auto-generated

#### Option B: Netlify

**Steps:**
1. Install Netlify CLI:
```bash
npm i -g netlify-cli
```

2. Deploy:
```bash
netlify deploy --prod
```

3. Add environment variables:
   - Site Settings → Build & Deploy → Environment
   - Add `VITE_GROQ_API_KEY`

4. Trigger redeploy

#### Option C: GitHub Pages

**Steps:**
1. Update `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/yourvoice/', // Replace with your repo name
  // ... rest of config
})
```

2. Add deploy script to `package.json`:
```json
"scripts": {
  "deploy": "npm run build && gh-pages -d dist"
}
```

3. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

4. Deploy:
```bash
npm run deploy
```

#### Option D: Custom Server (VPS/Cloud)

**Requirements:**
- Node.js installed on server
- Nginx or Apache for serving static files
- SSL certificate (Let's Encrypt recommended)

**Steps:**
1. Build project locally or on server:
```bash
npm run build
```

2. Copy `dist/` folder to server:
```bash
scp -r dist/* user@server:/var/www/yourvoice/
```

3. Configure Nginx:
```nginx
server {
    listen 80;
    server_name yourvoice.rw;

    root /var/www/yourvoice;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}
```

4. Set up SSL:
```bash
sudo certbot --nginx -d yourvoice.rw
```

---

## 🔒 Production Security

### API Key Management
- [ ] Use environment variables (never hardcode)
- [ ] Separate dev and production keys
- [ ] Set up API key rotation schedule
- [ ] Monitor API usage and set alerts
- [ ] Implement rate limiting if possible

### HTTPS Configuration
- [ ] Force HTTPS redirect
- [ ] Valid SSL certificate installed
- [ ] HSTS header configured
- [ ] Secure cookies (if any)

### Content Security Policy
Add to `index.html` or server config:
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' 'unsafe-eval'; 
               style-src 'self' 'unsafe-inline'; 
               connect-src 'self' https://api.groq.com;">
```

### Privacy Headers
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: no-referrer
Permissions-Policy: microphone=(self)
```

---

## 📊 Monitoring & Analytics

### Essential Metrics to Track

**Usage Metrics:**
- Daily active users (via anonymous hashes)
- Text mode vs Voice mode usage
- Average session duration
- Conversations per user

**Performance Metrics:**
- Page load time
- API response time
- TTS latency
- Error rates

**Crisis Metrics:**
- Crisis alerts triggered
- Emergency contacts clicked
- Report submissions
- NGO referrals made

### Recommended Tools

**Privacy-Friendly Analytics:**
- Plausible Analytics (privacy-focused)
- Simple Analytics (GDPR compliant)
- Self-hosted Matomo

**Error Tracking:**
- Sentry (configure with privacy in mind)
- LogRocket (session replay)
- Custom error logging

**Configuration Example:**
```typescript
// Only track anonymized data
analytics.track('conversation_started', {
  mode: 'voice', // or 'text'
  language: 'en', // or 'rw'
  timestamp: Date.now()
  // NO user hash or personal data
})
```

---

## 🌍 Domain & DNS Setup

### Domain Registration
- Register `.rw` domain for Rwanda-specific branding
- Alternative: `.org`, `.com`, `.ai`

### DNS Configuration
```
Type    Name        Value                   TTL
A       @           [server IP]             3600
A       www         [server IP]             3600
CNAME   www         yourvoice.rw            3600
```

### Recommended Domain Names
- yourvoice.rw
- yourvoice-rwanda.org
- yourvoiceai.rw
- mental-health-rw.org

---

## 📱 Progressive Web App (PWA) Setup

### Add PWA Manifest

Create `public/manifest.json`:
```json
{
  "name": "YourVoice AI",
  "short_name": "YourVoice",
  "description": "Mental health support for Rwanda",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#65a30d",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Add Service Worker

Create `public/sw.js`:
```javascript
// Basic caching for offline support
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('yourvoice-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json'
      ])
    })
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request)
    })
  )
})
```

### Benefits of PWA
- Install on mobile home screen
- Offline fallback support
- Faster load times
- Native app feel

---

## 🎓 Training & Documentation

### For Healthcare Professionals

**Training Materials Needed:**
- [ ] Platform overview document
- [ ] Dashboard user guide
- [ ] Case management procedures
- [ ] Crisis response protocols
- [ ] Privacy and confidentiality guidelines

**Workshop Agenda (2 hours):**
1. Introduction to YourVoice (15 min)
2. Platform demonstration (30 min)
3. Dashboard walkthrough (30 min)
4. Crisis handling procedures (30 min)
5. Q&A and practice (15 min)

### For NGO Partners

**Partnership Package:**
- [ ] Integration guide
- [ ] Referral procedures
- [ ] Contact information updates
- [ ] Success metrics reporting
- [ ] Feedback channels

### For End Users

**User Education:**
- [ ] Quick start guide (1-page)
- [ ] Video tutorial (3-5 min)
- [ ] FAQ document
- [ ] Privacy explanation
- [ ] Emergency contacts poster

---

## 🔄 Post-Deployment Tasks

### Week 1
- [ ] Monitor error logs daily
- [ ] Check API usage and costs
- [ ] Verify all features working in production
- [ ] Test on multiple devices/browsers
- [ ] Gather initial user feedback

### Week 2-4
- [ ] Analyze usage patterns
- [ ] Identify common user issues
- [ ] Optimize slow-loading components
- [ ] Review and update NGO contacts
- [ ] Plan feature improvements

### Monthly
- [ ] Review analytics dashboard
- [ ] Update crisis keyword list
- [ ] Rotate API keys (security)
- [ ] Backup user feedback data
- [ ] Update documentation

### Quarterly
- [ ] Conduct security audit
- [ ] Review partnership agreements
- [ ] Update training materials
- [ ] Plan major feature releases
- [ ] Stakeholder reporting

---

## 🐛 Rollback Plan

### If Issues Occur Post-Deployment

**Minor Issues (UI bugs, typos):**
1. Fix in codebase
2. Test locally
3. Deploy fix
4. Monitor for 24 hours

**Major Issues (broken features, security concerns):**
1. Immediately rollback to previous version
2. Investigate issue in development
3. Implement thorough fix
4. Test extensively
5. Gradual re-deployment

**Rollback Commands:**

Vercel:
```bash
vercel rollback
```

Netlify:
```bash
netlify rollback
```

Custom Server:
```bash
# Keep previous dist backup
cp -r dist dist-backup-$(date +%Y%m%d)
# Restore from backup if needed
rm -rf dist && cp -r dist-backup-20250126 dist
```

---

## 📞 Support & Maintenance

### Support Channels
- [ ] Set up support email: support@yourvoice.rw
- [ ] Create feedback form in app
- [ ] Monitor social media mentions
- [ ] Partner hotline for NGOs

### Incident Response
- [ ] Define severity levels (P0-P3)
- [ ] Create on-call schedule
- [ ] Document escalation procedures
- [ ] Prepare communication templates

### Maintenance Windows
- Scheduled: Weekly Sunday 2-4 AM EAT
- Emergency: As needed with notifications
- Updates: Bi-weekly deployment cycle

---

## ✅ Final Launch Checklist

### Technical
- [ ] Production build successful
- [ ] All environment variables set
- [ ] SSL certificate active
- [ ] Domain pointing correctly
- [ ] CDN configured (if applicable)
- [ ] Error tracking enabled
- [ ] Analytics configured
- [ ] Backup system in place

### Content
- [ ] All text reviewed and approved
- [ ] Translations verified by native speakers
- [ ] NGO contacts verified
- [ ] Legal disclaimers included
- [ ] Privacy policy published
- [ ] Terms of service published

### Partnerships
- [ ] NGO agreements signed
- [ ] Isange One Stop Centers notified
- [ ] Rwanda Biomedical Center informed
- [ ] Ministry of Health approval (if required)
- [ ] Partner logos and links approved

### Marketing & Launch
- [ ] Press release prepared
- [ ] Social media announcement ready
- [ ] Launch event planned (if applicable)
- [ ] Influencer/advocate outreach
- [ ] Educational institutions notified

### Team Readiness
- [ ] Support team trained
- [ ] On-call schedule established
- [ ] Monitoring dashboards set up
- [ ] Emergency contacts shared
- [ ] Launch day plan documented

---

## 🎉 You're Ready to Launch!

**Final Steps:**
1. ✅ Complete all checklist items above
2. 🚀 Deploy to production
3. 📊 Monitor for first 24-48 hours closely
4. 📣 Announce launch to partners and public
5. 💚 Celebrate helping people in Rwanda!

---

**Remember:** This platform helps save lives. Quality, privacy, and reliability are paramount.

**Emergency Contacts (Always Keep Updated):**
- Rwanda Emergency: 112
- GBV Hotline: 3512
- Caraes Ndera: +250 788 386 200
- Isange CHUK: +250 788 386 200

---

**Good luck with your launch! 🌟**
