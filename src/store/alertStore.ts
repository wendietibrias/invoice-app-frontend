import { create } from "zustand";

interface IAlert {
    message:string;
    variant:string;
    isOpen:boolean;
    openHandler:(message:string,variant:string) => void;
    closeHandler: () => void
}

const useAlertStore = create<IAlert>((set) => ({
    message:"",
    variant:"",
    isOpen:false,
    openHandler:(message : string, variant : string) => set((state) => ({
         message:message,
        variant:variant,
        isOpen:true
    })),
    closeHandler: () => set((state) => ({
         isOpen:false,
         message:"",
         variant:""
    }))
}));

export default useAlertStore;