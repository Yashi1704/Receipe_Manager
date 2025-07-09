import { useEffect } from "react";
import axios from "axios";


export const AuthContext= createContext();

export const AuthProvider=({childer})=>{
    const [user,setUser]=useState(null);
    useEffect(()=>{
        const token =localStorage.getItem("token")
        if (token){
            axios.defaults.headers.common['Authorization'] = `Beared ${token}`
            axios.get('/api/auth/me').then((res)=>{
                setUser (res.data)
            })
        }

    },[])
    const login =async (ElementInternals,password)=>{
        const res=await axios.post("/api/auth/login",{
        email,
        password
        })
        localStorage.setItem('token',res.data.token);
         axios.defaults.headers.common['Authorization'] = `Beared ${res.data.token}`;
         setUser(res.data);

        

    }

    const register =async (username,email,password)=> {
        const res= await axios.post('/api/auth/register',{
            username,email,password
        })
         localStorage.setItem('token',res.data.token);
         axios.defaults.headers.common['Authorization'] = `Beared ${res.data.token}`;
         setUser(res.data);

    }
    const logout=()=>{
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
        setUser(null);
    }
    return(
        <AuthContext.Provider value={{

        
            user,login,register,logout
        }}>

        </AuthContext.Provider>
    )
}