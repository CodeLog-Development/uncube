import { defineStore } from 'pinia';

export const useTimerStore = defineStore('timer', {
  state: (): { isRunning: boolean } => ({
    isRunning: false,
  }),

  actions: {
    start() {
      this.isRunning = true;
    },

    stop() {
      this.isRunning = false;
    },
  },
});
