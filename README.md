# MindBridgeAI

> **An AI-powered mental health and abuse support platform providing confidential guidance, crisis intervention, and NGO case management for communities in Rwanda and beyond.**

[![React](https://img.shields.io/badge/React-19.2-blue?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue?logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8.0-purple?logo=vite)](https://vitejs.dev)

---

##  Table of Contents
- Overview  
- Key Features  
- Technology Stack  
- Quick Start  
- Project Structure  
- Usage  
- Architecture  
- Privacy & Security  
- Contributing  
- License  
- Support  

---

##  Overview

MindBridgeAI is a digital platform designed to connect individuals in need of mental health or abuse support with professional help and NGOs.

It operates in two main modes:

- **User Mode:** A confidential AI chat system providing emotional support and guidance  
- **NGO Mode:** A case management dashboard for tracking and responding to user reports  

The platform prioritizes **privacy, accessibility, and rapid intervention**, especially for underserved communities in Rwanda.

---

##  Key Features

###  User Features
- Anonymous AI chat support (no login required)
- Real-time emotional and crisis guidance
- Multilingual support (English & Kinyarwanda)
- Crisis detection and alert system
- Quick-start prompts for common mental health needs

###  NGO Dashboard
- Case management system with tracking
- Risk level classification (Low / Medium / High)
- Analytics and reporting dashboard
- Case search, filtering, and updates
- Notification system for urgent cases

---

##  Technology Stack

### Frontend
- React 19
- TypeScript
- Vite
- Chakra UI
- Framer Motion
- Recharts

### AI & Backend Services
- Groq API
- OpenAI API
- Emotion detection utilities

---

## Quick Start
Prerequisites
Node.js 18+
npm 9+
Modern browser (Chrome, Firefox, Edge)
Installation
git clone https://github.com/your-org/mindbridgeai.git
cd MindBridgeAI
npm install
Environment Setup

Create a .env.local file:

VITE_GROQ_API_KEY=your_groq_api_key_here

VITE_OPENAI_API_KEY=your_openai_api_key_here

 Without these API keys, the AI features will not work.

### Run Project
npm run dev

## Usage
### User Mode
Open platform
Start AI Support Chat
Receive emotional guidance
Submit concerns if needed
### NGO Mode
Open dashboard
View submitted cases
Track risk levels
Respond to urgent reports
Manage case progress
## Architecture

### MindBridgeAI uses a dual-mode architecture:

User Mode → AI Chat Interface
NGO Mode → Case Management Dashboard

### Both modes share a central service layer handling:

AI responses
Case creation
Risk analysis
Data routing
### Privacy & Security
No mandatory user accounts
No personal data tracking
Secure case handling for NGOs
Encrypted API communication
Privacy-first system design

## Impact

### MindBridgeAI aims to:

Improve access to mental health support
Increase reporting of abuse cases
Reduce stigma through confidentiality
Support rural and vulnerable communities
Strengthen NGO response systems


### Acknowledgments
Mental health professionals
NGO partners
Open-source community
Rwanda social support ecosystem


Built with love for mental health awareness and safe digital support.
