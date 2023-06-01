import { create } from "zustand";

interface IAuthStore {
    token:string | null;
    setupToken: (token : string) => void
}

const token = JSON.parse(localStorage.getItem("invoice-token") || "null") || null;

const useAuthStore = create<IAuthStore>((set) => ({
       token:token || null,
       setupToken: (token : string) => set((state) => ({
             token:token
       }))
}));

export default useAuthStore;