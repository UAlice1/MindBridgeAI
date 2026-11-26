/**
 * Text-to-Speech Service for Therapist Avatar
 * Handles voice synthesis with emotional tone variations
 */

export type VoiceEmotion = 'neutral' | 'caring' | 'hopeful' | 'concerned' | 'happy'

interface TTSOptions {
  language: 'en' | 'rw'
  emotion?: VoiceEmotion
  rate?: number
  pitch?: number
  volume?: number
  onStart?: () => void
  onEnd?: () => void
  onError?: (error: Error) => void
}

class TextToSpeechService {
  private synthesis: SpeechSynthesis | null = null
  private currentUtterance: SpeechSynthesisUtterance | null = null
  private isSupported: boolean = false
  private voices: SpeechSynthesisVoice[] = []

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis
      this.isSupported = true
      
      // Load voices (they may load asynchronously)
      this.loadVoices()
      
      if (this.synthesis.onvoiceschanged !== undefined) {
        this.synthesis.onvoiceschanged = () => {
          this.loadVoices()
        }
      }
    }
  }

  private loadVoices(): void {
    if (this.synthesis) {
      this.voices = this.synthesis.getVoices()
    }
  }

  /**
   * Check if TTS is supported in the current browser
   */
  isAvailable(): boolean {
    return this.isSupported && this.synthesis !== null
  }

  /**
   * Get available voices for a language
   */
  private getVoiceForLanguage(language: 'en' | 'rw'): SpeechSynthesisVoice | null {
    if (this.voices.length === 0) {
      this.loadVoices()
    }

    // Try to find a voice for the specific language
    const langCode = language === 'rw' ? 'rw' : 'en'
    
    // Prefer female voices for a warmer, more caring tone
    let voice = this.voices.find(
      v => v.lang.startsWith(langCode) && v.name.toLowerCase().includes('female')
    )
    
    if (!voice) {
      voice = this.voices.find(v => v.lang.startsWith(langCode))
    }
    
    // Fallback for Kinyarwanda: use English if Kinyarwanda is not available
    if (!voice && language === 'rw') {
      voice = this.voices.find(v => v.lang.startsWith('en'))
    }
    
    // Last resort: use default voice
    if (!voice && this.voices.length > 0) {
      voice = this.voices[0]
    }

    return voice || null
  }

  /**
   * Get voice parameters based on emotion
   */
  private getEmotionParameters(emotion: VoiceEmotion): { rate: number; pitch: number } {
    switch (emotion) {
      case 'caring':
        return { rate: 0.85, pitch: 1.1 } // Slower, slightly higher pitch
      case 'hopeful':
        return { rate: 0.95, pitch: 1.15 } // Uplifting tone
      case 'concerned':
        return { rate: 0.8, pitch: 0.95 } // Slower, lower pitch
      case 'happy':
        return { rate: 1.05, pitch: 1.2 } // Faster, higher pitch
      case 'neutral':
      default:
        return { rate: 0.9, pitch: 1.0 } // Normal pace
    }
  }

  /**
   * Speak text with emotional tone
   */
  async speak(text: string, options: TTSOptions = { language: 'en' }): Promise<void> {
    if (!this.isAvailable() || !this.synthesis) {
      console.warn('Text-to-speech is not available')
      options.onError?.(new Error('TTS_NOT_SUPPORTED'))
      return
    }

    // Cancel any ongoing speech
    this.stop()

    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text)
      
      // Set voice
      const voice = this.getVoiceForLanguage(options.language)
      if (voice) {
        utterance.voice = voice
      }

      // Set emotion-based parameters
      const emotionParams = this.getEmotionParameters(options.emotion || 'neutral')
      utterance.rate = options.rate ?? emotionParams.rate
      utterance.pitch = options.pitch ?? emotionParams.pitch
      utterance.volume = options.volume ?? 1.0

      // Event handlers
      utterance.onstart = () => {
        options.onStart?.()
      }

      utterance.onend = () => {
        this.currentUtterance = null
        options.onEnd?.()
        resolve()
      }

      utterance.onerror = (event) => {
        this.currentUtterance = null
        const error = new Error(`TTS Error: ${event.error}`)
        options.onError?.(error)
        reject(error)
      }

      this.currentUtterance = utterance
      this.synthesis.speak(utterance)
    })
  }

  /**
   * Stop current speech
   */
  stop(): void {
    if (this.synthesis) {
      this.synthesis.cancel()
      this.currentUtterance = null
    }
  }

  /**
   * Pause current speech
   */
  pause(): void {
    if (this.synthesis && this.synthesis.speaking) {
      this.synthesis.pause()
    }
  }

  /**
   * Resume paused speech
   */
  resume(): void {
    if (this.synthesis && this.synthesis.paused) {
      this.synthesis.resume()
    }
  }

  /**
   * Check if currently speaking
   */
  isSpeaking(): boolean {
    return this.synthesis?.speaking ?? false
  }

  /**
   * Check if speech is paused
   */
  isPaused(): boolean {
    return this.synthesis?.paused ?? false
  }

  /**
   * Get list of available voices
   */
  getAvailableVoices(): SpeechSynthesisVoice[] {
    if (this.voices.length === 0) {
      this.loadVoices()
    }
    return this.voices
  }

  /**
   * Split long text into smaller chunks for better TTS performance
   */
  private splitIntoSentences(text: string): string[] {
    // Split by periods, question marks, exclamation marks, or newlines
    const sentences = text
      .split(/([.!?]\s+|\n+)/)
      .filter(s => s.trim().length > 0)
      .map(s => s.trim())

    // Combine very short segments
    const chunks: string[] = []
    let currentChunk = ''

    for (const sentence of sentences) {
      if (currentChunk.length + sentence.length < 200) {
        currentChunk += (currentChunk ? ' ' : '') + sentence
      } else {
        if (currentChunk) chunks.push(currentChunk)
        currentChunk = sentence
      }
    }

    if (currentChunk) chunks.push(currentChunk)

    return chunks
  }

  /**
   * Speak long text with chunking (better for long responses)
   */
  async speakLong(text: string, options: TTSOptions = { language: 'en' }): Promise<void> {
    const chunks = this.splitIntoSentences(text)
    
    for (let i = 0; i < chunks.length; i++) {
      const isFirst = i === 0
      const isLast = i === chunks.length - 1

      await this.speak(chunks[i], {
        ...options,
        onStart: isFirst ? options.onStart : undefined,
        onEnd: isLast ? options.onEnd : undefined,
      })
    }
  }
}

// Export singleton instance
export const ttsService = new TextToSpeechService()

// Helper function for emotion detection from AI response
export function detectResponseEmotion(text: string): VoiceEmotion {
  const lower = text.toLowerCase()

  // Caring/supportive
  if (
    lower.includes("i'm here") ||
    lower.includes("you're not alone") ||
    lower.includes('ndi hano') ||
    lower.includes('nturi wenyine') ||
    lower.includes('i understand') ||
    lower.includes('that sounds')
  ) {
    return 'caring'
  }

  // Hopeful/encouraging
  if (
    lower.includes('you can') ||
    lower.includes('it will') ||
    lower.includes('things can get better') ||
    lower.includes('there is hope') ||
    lower.includes('byiza') ||
    lower.includes('ushobora')
  ) {
    return 'hopeful'
  }

  // Concerned (crisis situations)
  if (
    lower.includes('please reach out') ||
    lower.includes('call') ||
    lower.includes('emergency') ||
    lower.includes('hamagara') ||
    lower.includes('isange') ||
    lower.includes('important to get help')
  ) {
    return 'concerned'
  }

  // Happy/positive
  if (
    lower.includes('great') ||
    lower.includes('wonderful') ||
    lower.includes('glad') ||
    lower.includes('nishimye') ||
    lower.includes('byiza cyane')
  ) {
    return 'happy'
  }

  return 'neutral'
}
