// WebSockets & Real-Time Event System Service
// Currently runs as an in-process event bus with simulated WebSocket lifecycle.
// Replace `connect()` body with an actual `new WebSocket(...)` or `io(...)` call
// once a live server endpoint is ready.

export type SocketEventType = 
  | 'TASK_UPDATED' 
  | 'LIVE_COMMENT' 
  | 'NOTIFICATION_RECEIVED'
  | 'notification'
  | 'meeting:updated'
  | 'task:assigned';

type SocketCallback = (data: any) => void;

class SocketService {
  private listeners: Map<string, SocketCallback[]> = new Map();
  private connected = false;
  private userId: string | null = null;

  /** Initialise the connection for a given user. */
  public connect(userId: string): void {
    if (this.connected) return;
    this.userId = userId;
    this.connected = true;
    console.log('[SocketService] Connected for user:', userId);

    // Simulate a server pushing a notification after 3 s (demo only)
    setTimeout(() => {
      this.emit('notification', {
        title: 'Meeting Processing Complete',
        message: 'Whisper transcription for "Q2 Planning" is ready.'
      });
    }, 3000);
  }

  /** Tear down the connection and clear all listeners. */
  public disconnect(): void {
    this.connected = false;
    this.userId = null;
    this.listeners.clear();
    console.log('[SocketService] Disconnected');
  }

  /** Register an event listener (alias for `subscribe`). */
  public on(event: string, callback: SocketCallback): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  /** Remove a specific event listener (alias for `unsubscribe`). */
  public off(event: string, callback: SocketCallback): void {
    const list = this.listeners.get(event) || [];
    this.listeners.set(event, list.filter((cb) => cb !== callback));
  }

  /** @deprecated Use `on()` instead. */
  public subscribe(event: SocketEventType, callback: SocketCallback): void {
    this.on(event, callback);
  }

  /** @deprecated Use `off()` instead. */
  public unsubscribe(event: SocketEventType, callback: SocketCallback): void {
    this.off(event, callback);
  }

  /** Dispatch an event to all registered listeners. */
  public emit(event: string, data: any): void {
    const list = this.listeners.get(event) || [];
    list.forEach((cb) => cb(data));
  }

  public get isConnected(): boolean {
    return this.connected;
  }
}

export const socketService = new SocketService();
