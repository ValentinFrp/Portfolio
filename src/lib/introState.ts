type Listener = () => void;

const listeners = new Set<Listener>();

export const introState = {
  done: false,
  progress: 0,
  finish() {
    if (this.done) return;
    this.done = true;
    this.progress = 1;
    listeners.forEach((listener) => listener());
  },
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};
