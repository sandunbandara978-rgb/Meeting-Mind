// Web Speech API interface definitions
export interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

export interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

export interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

export interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

export class SpeechService {
  private recognition: any = null;
  private isListening = false;
  private onResultCallback?: (text: string, isFinal: boolean) => void;
  private onErrorCallback?: (error: string) => void;

  constructor() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript && this.onResultCallback) {
          this.onResultCallback(finalTranscript, true);
        } else if (interimTranscript && this.onResultCallback) {
          this.onResultCallback(interimTranscript, false);
        }
      };

      this.recognition.onerror = (event: any) => {
        console.warn('Speech Recognition error:', event.error);
        if (this.onErrorCallback) {
          this.onErrorCallback(event.error);
        }
      };
    }
  }

  public isSupported(): boolean {
    return !!this.recognition;
  }

  public start(
    onResult: (text: string, isFinal: boolean) => void,
    onError?: (error: string) => void
  ) {
    this.onResultCallback = onResult;
    this.onErrorCallback = onError;

    if (this.recognition && !this.isListening) {
      try {
        this.recognition.start();
        this.isListening = true;
      } catch (err) {
        console.warn('Failed to start native recognition:', err);
      }
    }
  }

  public stop() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (err) {
        // ignore
      }
      this.isListening = false;
    }
  }
}

export const speechService = new SpeechService();
