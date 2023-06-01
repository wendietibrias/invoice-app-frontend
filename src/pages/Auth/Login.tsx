import { useState,useEffect,ChangeEvent } from "react";
import "../../styles/auth.scss";
import { ILoginForm,ILoginFormError } from "../../interfaces/useStateInterfaces";
import {Link,useNavigate} from "react-router-dom";
import { TbFileInvoice } from "react-icons/tb";
import { AiFillEye,AiOutlineEyeInvisible } from "react-icons/ai";
import APIAuth from "../../api/APIAuth"
import useAuthStore from "../../store/authStore";
import useAlertStore from "../../store/alertStore";
import { Alert } from "../../components";

const Login = () => {
    const navigate = useNavigate();
    const { setupToken,token } = useAuthStore();
    const { isOpen , openHandler, closeHandler } = useAlertStore();

    const [formError,setFormError] = useState<ILoginFormError>({
         email:false,
         password:false
    });
    const [form,setForm] = useState<ILoginForm>({
        email:"",
        password:""
    });
    const [showPass,setShowPass] = useState<boolean>(false);
    const submitHandler = async (e : any)   => {
        e.preventDefault();

        if(form.email === "" && form.password === "") {
            return setFormError({
                email:true,
                password:true
            });
        }

        if(form.email !== "" && form.password === "") {
            return setFormError({
                email:false,
                password:true
            });
        }

        if(form.email === "" && form.password !== "") {
            return setFormError({
                email:true,
                password:false
            });
        }

        setFormError({
            email:false,
            password:false
        });

        openHandler("Checking user data..." , "pending");

        try {
            const { data } = await APIAuth.post(`/login` ,form);

            if(data.status === 200) {
                 setupToken(data.request_token);
                 openHandler("Redirecting..."  , "success");
            }

        } catch(err : any) {
            const { response: { data } } = err;
            const message = data.message;
            openHandler(data.message, 'error');
        }
    }

    const changeHandler = (e : ChangeEvent)  => {
        const value = (e.target as HTMLInputElement).value;

        setForm({
            ...form,
            [(e.target as HTMLInputElement).name]:value
        });
    }

    useEffect(() => {
        if(isOpen === true) {
             setTimeout(() => {
                 return closeHandler();
             },3500)
        }

        if(token) {
            localStorage.setItem("invoice-token" , JSON.stringify(token));
            navigate("/");
        }
    },[isOpen,token]);

    return (
      <div className="auth-container">
          <div className="login-container">
              <div className="login-container__title">
                  <TbFileInvoice/>
                  <h4 className="login-container__title-text">Login Invoice</h4>
              </div>
              {isOpen && <Alert/>}
              <form onSubmit={submitHandler} className="login-container__form">
                   <div className="form-control">
                       <label>Email</label>
                       <input onChange={changeHandler} value={form.email} type="email" name="email"/>
                       {formError.email && <p className="form-required-error">Email field is required</p>}
                   </div>
                  <div className="form-control">
                      <label>Password</label>
                      <input onChange={changeHandler} value={form.password} name="password" type={showPass ? "text" : "password"}/>
                      {showPass ? (
                          <button type="button" onClick={() => setShowPass(false)} className="show-pass-button"><AiOutlineEyeInvisible/></button>
                          ) : (
                          <button type="button" onClick={() => setShowPass(true)} className="show-pass-button"><AiFillEye/></button>
                      )}
                      {formError.password && <p className="form-required-error">Password field is required</p>}
                  </div>
                  <button className="login-container__button" type="submit">Login</button>
              </form>
              <p className="redirect__page">
                  Don't have account ? <Link to="/auth/register">Register</Link>
              </p>
          </div>
      </div>
    )
}

export default Login;