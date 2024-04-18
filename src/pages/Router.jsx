import { useState, useEffect } from 'react'
import CryptoJS from 'crypto-js'
import Login from '@pages/Login';
import Dashboard from '@pages/Dashboard';
import Reporte from '@pages/Reporte';

function Router() {
    const [page, setPage] = useState("dashboard")
    const [loggedin, setLoggedIn] = useState(false)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [user, setUser] = useState(null)

    useEffect(() => {
        const loggedInStatus = localStorage.getItem('isLoggedIn');
        const loggedInToken = localStorage.getItem('loggedInToken');

        if (loggedInStatus === 'yes') {
            const base64Url = loggedInToken.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
            }).join(''));
            const jsonObject = JSON.parse(jsonPayload);

            console.log(jsonObject)

            setLoggedIn(true);
            setUser(jsonObject.name)
        }
    }, []);

    const ingresar = () => {
        async function apilogin() {
            const response = await fetch("http://127.0.0.1:3001/login", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: CryptoJS.MD5(password).toString()
                })
            })

            if (!response.ok) {
                alert("Usuario inválido, intentalo nuevamente")
                return;
            }

            const usr = await response.json()

            setUsername("")
            setPassword("")

            // setUser(usr)
            setLoggedIn(true)

            localStorage.setItem('isLoggedIn', 'yes');
            localStorage.setItem('loggedInToken', JSON.stringify(usr));
        }

        apilogin()
    }
    const salir = () => {
        setLoggedIn(false)
        localStorage.setItem('isLoggedIn', 'no');
    }

    const navegar = (componente) => {
        setPage(componente)
    }

    if (!loggedin) {
        return <Login
            ingresar={ingresar}
            setUsername={setUsername}
            setPassword={setPassword}
        />
    }

    let contenido;
    switch (page) {
        case "dashboard":
            contenido = <Dashboard />
            break;

        case "reporte":
            contenido = <Reporte />
            break;

        default:
            break;
    }

    return (
        <div>
            <nav>
                <b>{user}</b> |
                <a href="#" onClick={() => navegar("dashboard")}>Dashboard</a> |
                <a href="#" onClick={() => navegar("reporte")}>Reporte</a> |
                <a href="#" onClick={salir}>Salir</a>
            </nav>

            {contenido}
        </div>
    )
}

export default Router
