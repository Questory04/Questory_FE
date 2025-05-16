import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        accessToken: null,
        refreshToken: null,
    }),
    actions: {
        setTokens(accessToken, refreshToken) {
            this.accessToken = accessToken;
            this.refreshToken = refreshToken;
        },
        clearTokens() {
            this.accessToken = null;
            this.refreshToken = null;
        },
    },
    persist: true,
});
