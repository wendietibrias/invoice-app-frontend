import { IInvoiceItem } from "../../interfaces/componentPropsInterface";
import { useState,useEffect,ChangeEvent } from 'react';
import { Navigate,useLocation } from "react-router-dom";
import { Sidebar,ItemForm,InvoiceCard, InvoiceModal,Loading } from "../../components";
import "../../styles/homepage.scss";
import { HiPlusCircle } from "react-icons/hi";
import { randomIdString } from "../../utilities/VariableGlobal";
import { IItemForm } from '../../interfaces/useStateInterfaces';
import APIInvoice from '../../api/APIInvoice';
import useAuthStore from "../../store/authStore";


const Homepage = () => {
    const { pathname } = useLocation();

    const [loadInvoices,setLoadInvoices] = useState<boolean>(false);
    const { token } = useAuthStore();
    const [invoices,setInvoices] = useState([]);
    const [openModal,setOpenModal] = useState<boolean>(false);
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


    const [itemsForm,setItemsForm] = useState<IItemForm[]>([]);

    const fetchInvoices = async () => {
        setLoadInvoices(true);
        try {
            const { data } = await APIInvoice.get(`/user/all`);
            if(data.status === 200) {
                setInvoices(data.data);
            }
        } catch(err) {
           return err;
        }
        setLoadInvoices(false);

    }

    const discardModalData = () => {
         setForm({
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

         setOpenModal(false);
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
            invoiceRequest = await APIInvoice.post(`/create` ,{
                ...form,
                items:itemsForm
            });
        } else {
            invoiceRequest = await APIInvoice.post(`/create`, {
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
            fetchInvoices();
        }

    } catch(err) {
        return err;
    }
  }

  useEffect(() => {
      fetchInvoices();
  },[pathname])
 
    if(!token) {
        return <Navigate to="/auth/login"/>
    }

    return (
        <div className="main-container">
            <Sidebar/>
            <main className="main">
                 <div className="invoice-container">
                     <header className="invoice-header">
                        <div className="invoice-header-left-side">
                            <h2>Invoices</h2>
                            <p>these are {invoices.length} total invoices</p>
                        </div>
                         <div className="invoice-header-right-side">

                             <button onClick={() => setOpenModal(!openModal)}>
                                 <HiPlusCircle className="plus-icon"/>
                                 New invoice
                             </button>
                         </div>
                     </header>
                     {loadInvoices ? <Loading type="wrapper" isLoading={loadInvoices} /> : (
                         <div className="invoice-items-container">
                             {Array.isArray(invoices) && invoices.map((invoice : IInvoiceItem, idx:number) => <InvoiceCard key={idx} invoice={invoice}/>)}
                         </div>
                     )}
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

export default Homepage;