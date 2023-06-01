import {TbFileInvoice} from "react-icons/tb";
import {Link} from "react-router-dom";
import {ChangeEvent, useState} from "react";
import {IRegisterFormError, IRegisterForm} from "../../interfaces/useStateInterfaces";
import {AiFillEye, AiOutlineEyeInvisible} from "react-icons/ai";
import { Alert } from "../../components";
import useAlertStore from "../../store/alertStore";
import APIAuth from "../../api/APIAuth";
const Register = () => {
    const { isOpen,openHandler,closeHandler } = useAlertStore();
    const [form,setForm] = useState<IRegisterForm>({
        email:"",
        password:"",
        username:"",
        confirm:""
    });
    const [formError,setFormError] = useState<IRegisterFormError>({
        email:false,
        username:false,
        confirm:false,
        password:false
    });
    const [showPass,setShowPass] = useState<boolean>(false);

    const submitHandler = async (e : any)   => {
        e.preventDefault();

        if(form.email === "" && form.username === "" && form.password === "" && form.confirm === "") {
             return setFormError({
                 email:true,
                 username:true,
                 confirm:true,
                 password:true
             });
        }

        setFormError({
            email:false,
            username:false,
            confirm:false,
            password:false
        });

        openHandler('Creating user...' , 'pending');

        try {

            const { data } = await APIAuth.post('/register' , form);

            if(data.status === 200) {
                openHandler('Success create user' , 'success');
                setForm({
                    email:"",
                    password:"",
                    username:"",
                    confirm:""
                });
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

    return (
        <div className="auth-container">
            <div className="register-container">
                <div className="register-container__title">
                    <TbFileInvoice/>
                    <h4 className="register-container__title-text">Register Invoice</h4>
                </div>

                {isOpen && <Alert/>}
                <form onSubmit={submitHandler} className="register-container__form">
                    <div className="form-control">
                        <label>Username</label>
                        <input onChange={changeHandler} value={form.username} type="text" name="username"/>
                        {formError.username && <p className="form-required-error">Username is required</p>}
                    </div>
                    <div className="form-control">
                        <label>Email</label>
                        <input onChange={changeHandler} value={form.email} type="email" name="email"/>
                        {formError.email && <p className="form-required-error">Email is required</p>}

                    </div>
                    <div className="form-control">
                        <label>Password</label>
                        <input onChange={changeHandler} value={form.password} name="password" type={showPass ? "text" : "password"}/>
                        {showPass ? (
                            <button type="button" onClick={() => setShowPass(false)} className="show-pass-button"><AiOutlineEyeInvisible/></button>
                        ) : (
                            <button type="button" onClick={() => setShowPass(true)} className="show-pass-button"><AiFillEye/></button>
                        )}
                        {formError.password && <p className="form-required-error">Password is required</p>}
                    </div>
                    <div className="form-control">
                        <label>Confirm</label>
                        <input onChange={changeHandler} value={form.confirm} name="confirm" type={showPass ? "text" : "password"}/>
                        {showPass ? (
                            <button type="button" onClick={() => setShowPass(false)} className="show-pass-button"><AiOutlineEyeInvisible/></button>
                        ) : (
                            <button type="button" onClick={() => setShowPass(true)} className="show-pass-button"><AiFillEye/></button>
                        )}
                        {formError.password && <p className="form-required-error">Confirm password is required</p>}

                    </div>
                    <button className="register-container__button" type="submit">Register</button>
                </form>
                <p className="redirect__page">
                    Already have account ? <Link to="/auth/login">Login</Link>
                </p>
            </div>
        </div>
    )
}

export default Register;