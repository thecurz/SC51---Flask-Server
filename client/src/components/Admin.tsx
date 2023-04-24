import { useState } from 'react'
import { Navbar, Footer } from '.';
import { API_URL } from '.';
export default function Admin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const submitForm = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        try {
            //TODO: change urlk
            const response = await fetch(API_URL + '/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (response.status === 200) {
                setIsLoggedIn(true);
                setErrorMessage('');
            } else {
                setErrorMessage('Invalid username or password.');
            }
        } catch (error) {
            setErrorMessage('Error occurred while logging in.');
        }
    };
    //TODO: Add security to login
    return (
        <div>
            <Navbar />
            <div className="admin-container">
                {!isLoggedIn ? (
                    <div>
                        <h1>Admin Login</h1>
                        <form className="admin-form">
                            <label>
                                Username:
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </label>
                            <label>
                                Password:
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </label>
                            <button type="submit" onClick={submitForm}>Log In</button>
                        </form>
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                    </div>
                ) : (
                    <AdminMenu />
                )}
            </div>
            <Footer />
        </div>);
}
function AdminMenu() {
    const [categoria, setCategoria] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [nombre, setNombre] = useState('');
    const [precio, setPrecio] = useState('');
    const [approved, setApproved] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        try {
            //TODO: change url
            const response = await fetch(API_URL + '/POST/platillo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ categoria, descripcion, nombre, precio }),
            });

            if (response.status === 200) {
                setApproved(true);
                setErrorMessage("");
            } else {
                setApproved(false);
                setErrorMessage('Denied');
            }
        } catch (error) {
            setErrorMessage('Error occurred while posting platillos.');
        }
    };

    return (
        <>
            <form>
                <div>
                    <label htmlFor="categoria">Categoría:</label>
                    <input
                        type="text"
                        id="categoria"
                        value={categoria}
                        onChange={(e) => setCategoria(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="descripcion">Descripción:</label>
                    <textarea
                        id="descripcion"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="nombre">Nombre:</label>
                    <input
                        type="text"
                        id="nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="precio">Precio:</label>
                    <input
                        type="text"
                        id="precio"
                        value={precio}
                        onChange={(e) => setPrecio(e.target.value)}
                    />
                </div>
                <button type="submit" onClick={handleSubmit}>Enviar</button>
            </form>
            {approved}{errorMessage}</>
    );
}
