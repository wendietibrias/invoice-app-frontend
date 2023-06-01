import { BiChevronRight } from "react-icons/bi";
import {IInvoiceItem} from "../interfaces/componentPropsInterface";
import { Link } from "react-router-dom";
import currencyFormat from "../utilities/CurrencyFormat";

interface IInvoiceCardProps {
    invoice: IInvoiceItem
}

const InvoiceCard = ({ invoice } : IInvoiceCardProps) => {
    return (
        <div className="invoice-card-item">
            <h5>#{invoice?._id}</h5>
            <h5>{invoice.billTo.paymentDue}</h5>
            <h5>{invoice.billTo.clientName}</h5>
            <h5>{currencyFormat(invoice.billTo.amount)}</h5>
            <button className={`${invoice.billTo.status.toLowerCase()}`}>{invoice.billTo.status}</button>
            <Link to={`/invoice/${invoice._id}`}>
            <span className="redirect__section">
                <BiChevronRight/>
            </span>
            </Link>
        </div>
    )
}

export default InvoiceCard;