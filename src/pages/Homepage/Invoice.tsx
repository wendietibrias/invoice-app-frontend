import "../../styles/invoice.scss";
import { useEffect, useState,ChangeEvent } from 'react';
import { Navigate,useParams,useNavigate } from "react-router-dom";
import { BiChevronRight,BiChevronLeft } from "react-icons/bi";
import useAuthStore from '../../store/authStore';
import APIInvoice from '../../api/APIInvoice';
import { Sidebar,InvoiceModal } from "../../components";
import { Link } from "react-router-dom";
import { IItemForm } from "../../interfaces/useStateInterfaces";
import { randomIdString } from "../../utilities/VariableGlobal";
import DateParse from "../../utilities/DateParse";
import currencyFormat from "../../utilities/CurrencyFormat";
const ButtonUpdateStatus = ({ status, onUpdate } : { status : string,onUpdate : (status : string) => void }) => {
    if(status.toLowerCase() === "pending") {
        return (
            <button onClick={() => onUpdate("Paid")} className="paid">Mark as paid</button>
        )
    }

    if(status.toLowerCase() === "draft") {
        return (
            <button onClick={() => onUpdate("Pending")} className="pending">Mark as pending</button>
        )
    }

    if(status.toLowerCase() === "paid") {
        return (
            <button onClick={() => onUpdate("Draft")} className="pending">Mark as draft</button>
            )
    }

    return null;
}

const Invoice = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { token } = useAuthStore();

    const [loadInvoice,setLoadInvoice] = useState<boolean>(false);
    const [openModal,setOpenModal] = useState<boolean>(false);
    const [invoice,setInvoice] = useState<any>(null);
    const [itemsForm,setItemsForm] = useState<IItemForm[]>([]);
    const [form,setForm] = useState<any>({
        billFrom: {
            address:"",
            zipCode:"",
            country:"",
            city:"",
        },
        billTo: {
            clientName:"",
            clientEmail:"",
            address:"",
            city:"",
            zipCode:"",
            country:"",
            paymentDate:"",
            paymentDue:"",
            paymentTerms:"",
            productDescription:"",
            status:"Pending"
        },
        items:[],
    });

    const fetchInvoice = async () => {
        if(id) {
            setLoadInvoice(true);
            const { data:{ data,status } } = await APIInvoice.get(`/${id}`);

           if(status === 200) {
             setInvoice(data);
             setForm({
                billFrom: {
                    address:data.billFrom.address,
                    zipCode:data.billFrom.zipCode,
                    country:data.billFrom.country,
                    city:data.billFrom.city,
                },
                billTo: {
                    address:data.billTo.address,
                    zipCode:data.billTo.zipCode,
                    country:data.billTo.country,
                    city:data.billTo.city,
                    clientName:data.billTo.clientName,
                    clientEmail:data.billTo.clientEmail,
                    paymentDate:data.billTo.paymentDate,
                    paymentDue:data.billTo.paymentDue,
                    amount:data.billTo.amount,
                    productDescription:data.billTo.productDescription,
                    paymentTerms:data.billTo.paymentTerms,
                    status:data.billTo.status
                }
             });

             setItemsForm(data.items);
           }

           setLoadInvoice(false);
        }
    }

    const onUpdateInvoiceStatus = async (status : string) => {
         try {
             const { data } = await APIInvoice.patch(`/update/status/${invoice?._id}?status=${status}`);
             if(data.status === 200) {
                  fetchInvoice();
             }

         } catch(err : any) {
             return err;
         }
    }

    const generateID = () => {
        let length : number = 7;
        let idString : string[] = [];

        for(let i = 0; i < length; i++) {
            idString.push(randomIdString[Math.floor(Math.random() * randomIdString.length)]);
        }

        return idString.join("");
   }

   
   const addNewItemForm = () => {
    setItemsForm([
        ...itemsForm, 
         {
            qty:0,
            price:0,
            itemName:"",
            total:0,
            id:generateID()
         }
    ]);
}
    
    const discardModalData = () => {
        setOpenModal(false);
   }

   const deleteItemList = (id : string) => {
    const filterItems = itemsForm.filter((item) => item.id !== id ? item : '');
    setItemsForm(filterItems);
}

const changeHandler = (el : ChangeEvent , type : string) => {
  const value = (el.target as HTMLInputElement).value;
  const name = (el.target as HTMLInputElement).name;

  if(type === "billTo") {
      setForm({
         ...form ,
         billTo: {
             ...form.billTo, 
             [name]:value
         }
      })
  }

  if(type === "billFrom") {
     setForm({
         ...form,
         billFrom: {
             ...form.billFrom,
             [name]:value
         }
     })
  }
}

const changeItemHandler = (el : ChangeEvent) => {
  const value = (el.target as HTMLInputElement).value;
  const name = (el.target as HTMLInputElement).name;

  const attributeId = (el.target as HTMLInputElement).getAttribute('data-id');

  const mapItems = itemsForm.map((item) => {
     if(item.id === attributeId) {
        if(name === "itemName") {
         return {
              ...item,
              [name]:value
         }
        }
  
        if(name === "qty") {
           return {
             ...item,
             [name]:Number(value),
             total:Number(value) * Number(item.price)
           }
        }

        return {
         ...item,
         [name]:value ,
         total:Number(value) * Number(item.qty)
        }
     }

     return item 
  });

  setItemsForm(mapItems);
}

const submitHandler = async (e : any, type : string) => {
 e.preventDefault();

 let invoiceRequest;
 
 try {

     if(type === "create") {
         invoiceRequest = await APIInvoice.patch(`/update/${invoice?._id}` ,{
             ...form,
             items:itemsForm
         });
     } else {
         invoiceRequest = await APIInvoice.patch(`/update/${invoice?._id}`, {
            ...form,
            items:itemsForm,
            billTo: {
             ...form.billTo,
             status:"Draft"
            }
         })
     }

     const { data } = invoiceRequest;
     
     if(data.status) {
         fetchInvoice();
     }

     setOpenModal(false);

 } catch(err) {
     return err;
 }
}

const deleteInvoiceHandler = async (id : string) => {
     try {
         const { data } = await APIInvoice.delete(`/delete/${id}`);

         if(data.status === 200) {
             navigate("/");
         }
     } catch(err) {
         return err;
     }
}

    useEffect(() =>  {
       fetchInvoice();
    },[token,id])

    if(!token) {
        return <Navigate to="/" />
    }

    return (
        <div className="invoice-detail">
            <Sidebar/>
            <main className="main">
                <div className="detail-invoice-container">
                    <Link to="/">
                        <span className="redirect__section">
                            <BiChevronLeft  className="redirect__section-icon"/>
                            Go back
                        </span>
                    </Link>
                    <div className="detail-invoice-middle">
                        <div className="detail-invoice-middle__left">
                            <span>Status</span>
                            <button className={`${invoice?.billTo.status.toLowerCase()}`}>{invoice?.billTo.status}</button>
                        </div>
                        <div className="detail-invoice-middle__right">
                            <button onClick={() => setOpenModal(true)} className="edit-btn">Edit</button>
                            <button disabled={invoice ? false : true} onClick={() => deleteInvoiceHandler(invoice?._id)} className="delete-btn">Delete</button>
                            <ButtonUpdateStatus onUpdate={onUpdateInvoiceStatus} status={`${invoice?.billTo.status}`} />
                        </div>
                    </div>
                    <div className="detail-invoice-bottom">
                        <div className="detail-invoice-bottom__header">
                            <div className="left-side">
                                <h1>#{invoice?._id}</h1>
                                <h4>{invoice?.billTo?.productDescription}</h4>
                            </div>
                            <div className="right-side">
                                <h5>{invoice?.billFrom.address}</h5>
                                <h5>{invoice?.billFrom.zipCode}</h5>
                                <h5>{invoice?.billFrom.city}</h5>
                                <h5>{invoice?.billFrom.country}</h5>
                            </div>
                        </div>
                        <div className="detail-invoice-bottom__middle">
                           <div className="left-side">
                               <div className="invoice-date">
                                   <h4>Invoice date</h4>
                                   <h2>{DateParse(invoice?.billTo.paymentDate)}</h2>
                               </div>
                               <div className="payment-due">
                                   <h4>Payment due</h4>
                                   <h2>{DateParse(invoice?.billTo.paymentDue)}</h2>
                               </div>
                           </div>
                            <div className="center-side">
                                <h5>Bill To</h5>
                                <h4>{invoice?.billTo?.clientName}</h4>

                                <div className="address">
                                    <h5>{invoice?.billFrom.address}</h5>
                                    <h5>{invoice?.billFrom.zipCode}</h5>
                                    <h5>{invoice?.billFrom.city}</h5>
                                    <h5>{invoice?.billFrom.country}</h5>
                                </div>
                            </div>
                            <div className="right-side">
                                <h5>Sent To</h5>
                                <h4>{invoice?.billTo?.clientEmail}</h4>
                            </div>
                        </div>

                        <div className="detail-invoice-bottom__bottom">
                             <div className="items-container">
                                 <div className="items-container-table-tr">
                                     <h5>Item Name</h5>
                                     <h5>Qty</h5>
                                     <h5>Price</h5>
                                     <h5>Total</h5>
                                 </div>
                                 <div className="items-container-table-td">
                                     {invoice?.items?.map((item : any , idx : number) => (
                                         <div key={idx} className="item">
                                             <h5>{item.itemName}</h5>
                                             <h5>{item.qty}</h5>
                                             <h5>{item.price}</h5>
                                             <h5>{item.total}</h5>
                                         </div>
                                     ))}
                                 </div>
                             </div>
                            <div className="total-amount-container">
                                <h3>Amount Due</h3>
                                <h3>{currencyFormat(invoice?.items?.reduce((a : number ,b : any) => a + b.total ,0))}</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
               {/* modal */}

               <InvoiceModal 
              form={form}
              itemsForm={itemsForm}
              deleteItemList={deleteItemList}
              changeHandler={changeHandler}
              changeItemHandler={changeItemHandler}
              submitHandler={submitHandler}
              addNewItemForm={addNewItemForm}
              openModal={openModal}
              discardModalData={discardModalData}
              addNewItemList={addNewItemForm}
            />
         
            {/* modal */}
        </div>
    )
}

export default Invoice;