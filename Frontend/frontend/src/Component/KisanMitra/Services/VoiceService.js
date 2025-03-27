import { toast } from "sonner";

const languageCodeMap = {
  en: 'en-IN',
  hi: 'hi-IN',
  bn: 'bn-IN',
  te: 'te-IN',
  mr: 'mr-IN',
  ta: 'ta-IN',
  ur: 'ur-IN',
  gu: 'gu-IN',
  kn: 'kn-IN',
  ml: 'ml-IN',
  pa: 'pa-IN',
  or: 'or-IN',
  as: 'as-IN'
};

class VoiceService {
  constructor() {
    this.recognition = null;
    this.synthesis = window.speechSynthesis;
    this.isListening = false;
    this.voices = [];
    this.initializeSpeechRecognition();
    this.loadVoices();
  }

  initializeSpeechRecognition() {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognitionAPI();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
    } else {
      console.error("Speech recognition is not supported in this browser");
      toast.error("Voice input is not supported in your browser");
    }
  }

  loadVoices() {
    this.voices = this.synthesis.getVoices();
    
    if (this.voices.length === 0) {
      this.synthesis.onvoiceschanged = () => {
        this.voices = this.synthesis.getVoices();
      };
    }
  }

  startListening(language, onResult, onEnd) {
    if (!this.recognition) {
      toast.error("Voice input is not supported in your browser");
      return false;
    }

    if (this.isListening) {
      this.stopListening();
    }

    try {
      this.recognition.lang = languageCodeMap[language] || 'en-IN';
      
      this.recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join(' ');
        
        const isFinal = event.results[0].isFinal;
        onResult(transcript, isFinal);
      };

      this.recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        toast.error(`Voice input error: ${event.error}`);
        this.isListening = false;
        onEnd();
      };

      this.recognition.onend = () => {
        this.isListening = false;
        onEnd();
      };

      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      toast.error("Could not start voice input");
      this.isListening = false;
      onEnd();
      return false;
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
        this.isListening = false;
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
    }
  }

  speak(text, language, onEnd) {
    if (!this.synthesis) {
      toast.error("Text-to-speech is not supported in your browser");
      return;
    }

    this.synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = languageCodeMap[language] || 'en-IN';
    
    if (this.voices.length === 0) {
      this.voices = this.synthesis.getVoices();
    }
    
    const languageCode = languageCodeMap[language].split('-')[0];
    const languageVoice = this.voices.find(voice => 
      voice.lang.startsWith(languageCode) && voice.localService === false
    );
    
    if (languageVoice) {
      utterance.voice = languageVoice;
    } else {
      const fallbackVoice = this.voices.find(voice => 
        voice.lang.startsWith(languageCode)
      );
      
      if (fallbackVoice) {
        utterance.voice = fallbackVoice;
      }
    }

    utterance.rate = 0.9;
    utterance.pitch = 1.0;

    if (onEnd) {
      utterance.onend = onEnd;
    }

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      if (onEnd) onEnd();
    };

    this.synthesis.speak(utterance);
  }

  stopSpeaking() {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }

  isAvailable() {
    return !!this.recognition;
  }
}

const voiceService = new VoiceService();
export default voiceService;