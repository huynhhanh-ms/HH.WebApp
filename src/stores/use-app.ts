import type { AccountResponse } from "src/domains/dto/account-response";

import { create } from "zustand";
import { useMutation } from "@tanstack/react-query";
import { persist, createJSONStorage } from "zustand/middleware";

import { AuthApi } from "src/services/api/auth.api";
import { ApiQueryKey } from "src/services/api-query-key";
import { LoginRequest } from "src/domains/dto/login-request";

interface AuthState {
	isLoggedIn: boolean,
	user: AccountResponse | null,
	accessToken: string | null
}

interface AuthAction {
	login: (accessToken: string) => Promise<void>,
	logout: () => void,
	setUser: (user: AccountResponse) => void
}

export const useApp = create<AuthState & AuthAction, any>(persist<AuthState & AuthAction, any>((set, get) => ({
	isLoggedIn: false,
	user: null,
	accessToken: null,

	login: async (accessToken) => {
		const user = await AuthApi.me(accessToken);
		if (user) {
			set({ accessToken, isLoggedIn: true, user });
		}
	},

	logout: () => {
		set({ user: null, isLoggedIn: false, accessToken: null });
	},

	setUser: (user) => {
		set({ user });
	},

}), {
	name: "auth",
	storage: createJSONStorage(() => localStorage),
}));

