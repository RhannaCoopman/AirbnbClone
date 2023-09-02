import axios from "axios";
import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const {setUser} = useContext(UserContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const {data} = await axios.post("/login", {
        email, 
        password
      });

      console

      if(data) {
        console.log('logindata: ' + data);
        setUser(data);
  
        alert('Logged in')

        setRedirect(true);

      } else {
        alert('Login failed')
      }

    } catch (error) {
      alert('Login failed')
    }
  }

  if(redirect) {
    return <Navigate to={'/'} />
  }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="-mt-64  ">
        <h1 className="text-4xl text-center mb-4">Login</h1>
        <form className="max-w-md mx-auto" onSubmit={handleLogin}>
          <input type="email" 
                placeholder='your@email.com' 
                value={email} 
                onChange={e => setEmail(e.target.value)} />
          <input type="password" 
                placeholder='password' 
                value={password} 
                onChange={e => setPassword(e.target.value)} />

          <button className="primary">Login</button>

          <div className="text-center py-2">
            <span className="text-gray-500">Don&apos;t have an account yet? </span>
            <Link to={"/register"} className="underline text-black">Register here</Link>
          </div>
        </form>
      </div>

    </div>
  );
};

export default LoginPage;