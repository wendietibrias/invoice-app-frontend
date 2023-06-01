import { ChangeEvent } from "react";

export interface IInvoiceItem {
    billTo:any;
    billFrom:any;
    items:any;
    user_id:string;
    _id:string;
}

export interface IInvoiceModalProps {
    openModal:boolean;
    addNewItemForm: () => void;
    submitHandler : (e : any , type:string) => void;
    deleteItemList : (id : string) => void;
    discardModalData: () => void;
    changeItemHandler : (e : ChangeEvent) => void;
    addNewItemList : () => void;
    form:any;
    changeHandler : (e : ChangeEvent , type : string) => void;
    itemsForm: any[];
}

export interface ILoadingProps {
    type : string;
    isLoading:boolean;
}