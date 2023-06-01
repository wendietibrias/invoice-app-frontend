import { AiOutlinePlus } from 'react-icons/ai';
import { FiTrash } from "react-icons/fi";
import { memo } from "react";
import ItemForm from './ItemForm';
import { IInvoiceModalProps } from '../interfaces/componentPropsInterface';

const InvoiceModal = memo(({ 
    form, 
    openModal,
    changeHandler,
    itemsForm,
    discardModalData,
    changeItemHandler,
    deleteItemList ,
    addNewItemForm,
    submitHandler
} : IInvoiceModalProps) => {
    return (
        <div className={`invoice-modal ${openModal ? 'active' : ''}`}>
        <h2>New Invoice</h2>
        <form className="form-all-container">
            <div className="bill-from-form-container">
                <h5>Bill From</h5>
                {/* bill from start */}
                <div className="bill-from-form-container__form">
                    <div className="full-form">
                        <label>Address Street</label>
                        <input onChange={(e) => changeHandler(e, "billFrom")} value={form.billFrom.address} type="text" name="address" />
                    </div>
                    <div className="split-form">
                        <div className="form-split-item">
                            <label>City</label>
                            <input onChange={(e) => changeHandler(e, "billFrom")} value={form.billFrom.city}  name="city" type="text"/>
                        </div>
                        <div className="form-split-item">
                            <label>Zip Code</label>
                            <input onChange={(e) => changeHandler(e, "billFrom")} value={form.billFrom.zipCode}  name="zipCode" type="text"/>
                        </div>
                        <div className="form-split-item">
                            <label>Country</label>
                            <input onChange={(e) => changeHandler(e, "billFrom")} value={form.billFrom.country}  name="country" type="text"/>
                        </div>
                    </div>
                </div>
                {/* bill from end */}


            </div>
            {/* bill to start */}
            <div className="bill-to-form-container">
                <h5>Bill To</h5>

                <div className="full-form">
                    <label>Client Name</label>
                    <input value={form.billTo.clientName} onChange={(e) => changeHandler(e, "billTo")} type="text" name="clientName" />
                </div>

                <div className="full-form">
                    <label>Client Email</label>
                    <input value={form.billTo.clientEmail}  onChange={(e) => changeHandler(e, "billTo")} type="text" name="clientEmail" />
                </div>
                <div className="full-form">
                    <label>Amount</label>
                    <input value={form.billTo.amount}  onChange={(e) => changeHandler(e, "billTo")} type="number" name="amount" />
                </div>

                <div className="full-form">
                    <label>Street Address</label>
                    <input value={form.billTo.address}  onChange={(e) => changeHandler(e, "billTo")} type="text" name="address" />
                </div>
                <div className="split-form">
                    <div className="form-split-item">
                        <label>City</label>
                        <input value={form.billTo.city}  onChange={(e) => changeHandler(e, "billTo")} name="city" type="text"/>
                    </div>
                    <div className="form-split-item">
                        <label>Zip Code</label>
                        <input value={form.billTo.zipCode}  onChange={(e) => changeHandler(e, "billTo")} name="zipCode" type="text"/>
                    </div>
                    <div className="form-split-item">
                        <label>Country</label>
                        <input value={form.billTo.country}  onChange={(e) => changeHandler(e, "billTo")} name="country" type="text"/>
                    </div>
                </div>
                <div className="split-form-two">
                    <div className="form-split-item">
                        <label>Payment Date</label>
                        <input value={form.billTo.paymentDate}  onChange={(e) => changeHandler(e, "billTo")} name="paymentDate" type="date"/>
                    </div>
                    <div className="form-split-item">
                        <label>Payment Due</label>
                        <input value={form.billTo.paymentDue}  onChange={(e) => changeHandler(e, "billTo")} name="paymentDue" type="date"/>
                    </div>
                </div>
                <div className="full-form">
                    <label>Payment Terms</label>
                    <input value={form.billTo.paymentTerms}  onChange={(e) => changeHandler(e, "billTo")} type="text" name="paymentTerms" />
                </div>
                <div className="full-form">
                    <label>Product Description</label>
                    <input value={form.billTo.productDescription}  onChange={(e) => changeHandler(e, "billTo")}  type="text" name="productDescription" />
                </div>
            </div>

            <div className="items-container">
                <h4>Item List</h4>
                <div className="items-container__title">
                    <h5 className="item-name">Item Name</h5>
                    <h5 className="qty">Qty</h5>
                    <h5 className="price">Price</h5>
                    <h5 className="total">Total</h5>
                </div>
                <div className="items-container__forms">
                    {Array.isArray(itemsForm) && itemsForm.length > 0 && itemsForm.map((item : any ,idx : number) => (
                        <ItemForm onChange={changeItemHandler} key={idx} item={item} onDelete={deleteItemList}  />
                    ))}
                </div>
                <button type="button" onClick={addNewItemForm} className="add-item__btn"><AiOutlinePlus className="icon"/>Add Item List</button>

            </div>
            <div className="modal-action-invoice">
                <button type="button" onClick={discardModalData} className="discard__btn">Discard</button>
                <div className="right-side-action">
                    <button onClick={(e) => submitHandler(e,  "draft")} type="button" className="save-draft__btn">Save Draft</button>
                    <button onClick={(e) => submitHandler(e, "create")} data-id="create" type="button" className="create-invoice__btn">Create Invoice</button>
                </div>
            </div>
        </form>
    </div>
    )
})

export default InvoiceModal;