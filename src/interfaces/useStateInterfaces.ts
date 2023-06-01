
 export interface ILoginForm {
    email : string;
    password : string
 }

 export interface ILoginFormError {
     email:boolean;
     password:boolean;
 }

 export interface IRegisterForm {
    username : string;
    email : string;
    password : string;
    confirm : string
 }

 export interface IRegisterFormError {
     username:boolean;
     email:boolean;
     password:boolean;
     confirm:boolean;
 }

 export interface IItemForm {
     qty:number;
     itemName:string;
     price:number;
     total:number;
     id:string;
     
 }