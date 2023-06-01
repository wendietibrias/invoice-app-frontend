import {FiTrash} from "react-icons/fi";
import { ChangeEvent } from "react";
import currencyFormat from "../utilities/CurrencyFormat";

interface IItemForm {
   item: {
       qty:number;
       total:number;
       price:number;
       itemName:string;
       id:string;
   }
   onDelete: (id : string) => void,
   onChange : (el : ChangeEvent) => void
}
const ItemForm = ({ item,onDelete,onChange } : IItemForm) => {
    return (
        <div className="items-container__forms-item">
            <input onChange={onChange} type="text" data-id={item.id} name="itemName" value={item.itemName}/>
            <input onChange={onChange} type="number" data-id={item.id}  name="qty" value={item.qty} />
            <input onChange={onChange} type="number" data-id={item.id}  name="price" value={item.price} />
            <h5>{currencyFormat(item.total)}</h5>
            <button onClick={() => onDelete(item.id)} className="delete-item__btn"><FiTrash/></button>
        </div>
    )
}

export default ItemForm;