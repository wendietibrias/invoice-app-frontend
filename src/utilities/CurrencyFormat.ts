
export default function currencyFormat(currency : number) {
     return new Intl.NumberFormat('en-US' , {
        style:"currency",
        currency:"USD"
     }).format(Number(currency));
}