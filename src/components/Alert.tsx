import useAlertStore from "../store/alertStore";
const Alert = () => {
     const { message , variant , isOpen ,closeHandler } = useAlertStore();

    return (
        <div className={`alert-container ${variant}`}>
          <h4>{message}</h4>
          <button onClick={() => closeHandler()} className="close-alert__btn">x</button>
        </div>
    )
}

export default Alert;