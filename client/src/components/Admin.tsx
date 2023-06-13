import { useEffect, useState } from 'react'
import { Navbar, Footer } from '.';
import { API_URL } from '.';

interface Pedido {
    "ID": number;
    "fecha": Date;
    "id_cliente": string;
    "id_platillo": string;
}

interface Platillo {
    "nombre": string;
    "descripcion": string;
    "categoria": string;
    "precio": string;
    "ID": string;
}
interface Cliente {
    "correo": string;
    "direccion": string;
    "celular": string;
    "clave": string;
    "ID": string;
}

const fetchPedidos = async () => {
    //TODO: change url for production
    const data = await fetch(API_URL + "/GET/pedido").then(res => res.json());
    return data;
}
const fetchPlatillos = async () => {
    //TODO: change url for production
    const data = await fetch(API_URL + "/GET/platillo").then(res => res.json());
    return data;
}
const fetchClientes = async () => {
    //TODO: change url for production
    const data = await fetch(API_URL + "/GET/cliente").then(res => res.json());
    return data;
}

export default function Admin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [platillos, setPlatillos] = useState<Platillo[]>([]);
    const [clientes, setClientes] = useState<Cliente[]>([])
    useEffect(() => {
        if (isLoggedIn && pedidos.length === 0) {
            (async () => {
                setPedidos(await fetchPedidos())
                setPlatillos(await fetchPlatillos())
                console.log(await fetchClientes())
                setClientes(await fetchClientes())
            })()
        }
    }, [isLoggedIn]);

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
                            <input
                                className='input-area'
                                placeholder='Username'
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <input
                                className='input-area'
                                placeholder='Password'
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button type="submit" onClick={submitForm}>Log In</button>
                        </form>
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                    </div>
                ) : (
                    <>
                        <CrearPlatilloForm />
                        <CrearClienteForm />
                        <ActualizarPlatilloForm />
                        <RemoverPlatilloForm />
                        <PlatillosChart platillos={platillos} />
                        <PedidosChart pedidos={pedidos} />
                        <ClientesChart clientes={clientes} />
                    </>
                )}
            </div>
            <Footer />
        </div>);
}
function CrearPlatilloForm() {
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
            <h1>Agregar Platillo</h1>
            <form>
                <div>
                    <input
                        className='input-area'
                        type="text"
                        id="nombre"
                        value={nombre}
                        placeholder='Nombre'
                        onChange={(e) => setNombre(e.target.value)}
                    />
                </div>
                <div>
                    <input
                        className='input-area'
                        type="text"
                        id="precio"
                        value={precio}
                        placeholder='Precio'
                        onChange={(e) => setPrecio(e.target.value)}
                    />
                </div>
                <div>
                    <textarea
                        className='input-area'
                        id="descripcion"
                        value={descripcion}
                        placeholder='Descripcion'
                        onChange={(e) => setDescripcion(e.target.value)}
                    />
                </div>
                <div>
                    <input
                        className='input-area'
                        type="text"
                        id="categoria"
                        value={categoria}
                        placeholder='Categoria'
                        onChange={(e) => setCategoria(e.target.value)}
                    />
                </div>
                <button className='navbar-button' type="submit" onClick={handleSubmit}>Enviar</button>
            </form>
            {approved}{errorMessage}</>
    );
}
function RemoverPlatilloForm() {
    const [approved, setApproved] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [nombre, setNombre] = useState("");

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        try {
            //TODO: change url
            const response = await fetch(API_URL + '/REM/platillo', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre }),
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
            <h1>Remover Platillo</h1>
            <form>
                <div>
                    <input
                        className='input-area'
                        type="text"
                        id="id"
                        value={nombre}
                        placeholder='Id del platillo'
                        onChange={(e) => setNombre(e.target.value)}
                    />
                </div>
                <button className='navbar-button' type="submit" onClick={handleSubmit}>Enviar</button>
            </form>
            {approved}{errorMessage}</>
    );
}

function ActualizarPlatilloForm() {
    const [id, setId] = useState('');
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
            const response = await fetch(API_URL + '/PUT/platillo', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ categoria, descripcion, nombre, precio, id }),
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
            <h1>Actualizar platillo</h1>
            <form>
                <div>
                    <input
                        className='input-area'
                        type="text"
                        id="id"
                        value={id}
                        placeholder='id'
                        onChange={(e) => setId(e.target.value)}
                    />
                </div>
                <div>
                    <input
                        className='input-area'
                        type="text"
                        id="nombre"
                        value={nombre}
                        placeholder='Nuevo nombre'
                        onChange={(e) => setNombre(e.target.value)}
                    />
                </div>
                <div>
                    <input
                        className='input-area'
                        type="text"
                        id="precio"
                        value={precio}
                        placeholder='Nuevo precio'
                        onChange={(e) => setPrecio(e.target.value)}
                    />
                </div>
                <div>
                    <textarea
                        className='input-area'
                        id="descripcion"
                        value={descripcion}
                        placeholder='Nueva descripcion'
                        onChange={(e) => setDescripcion(e.target.value)}
                    />
                </div>
                <div>
                    <input
                        className='input-area'
                        type="text"
                        id="categoria"
                        value={categoria}
                        placeholder='Nueva categoria'
                        onChange={(e) => setCategoria(e.target.value)}
                    />
                </div>
                <button className='navbar-button' type="submit" onClick={handleSubmit}>Enviar</button>
            </form>
            {approved}{errorMessage}</>
    );
}

function CrearClienteForm() {
    const [approved, setApproved] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [correo, setCorreo] = useState('');
    const [nombre, setNombre] = useState('');
    const [clave, setClave] = useState("");
    const [direccion, setDireccion] = useState('');
    const [celular, setCelular] = useState("");

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        try {
            //TODO: change url
            const response = await fetch(API_URL + '/POST/cliente', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ correo, nombre, clave, direccion, celular }),
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
            <h1>Agregar Cliente</h1>
            <form>
                <div>
                    <input
                        className='input-area'
                        type="text"
                        id="correo"
                        value={correo}
                        placeholder='Correo'
                        onChange={(e) => setCorreo(e.target.value)}
                    />
                </div>
                <div>
                    <input
                        className='input-area'
                        type="text"
                        id="nombre"
                        value={nombre}
                        placeholder='Nombre'
                        onChange={(e) => setNombre(e.target.value)}
                    />
                </div>
                <div>
                    <input
                        className='input-area'
                        type="text"
                        id="clave"
                        value={clave}
                        placeholder='Clave'
                        onChange={(e) => setClave(e.target.value)}
                    />
                </div>
                <div>
                    <textarea
                        className='input-area'
                        id="direccion"
                        value={direccion}
                        placeholder='Direccion'
                        onChange={(e) => setDireccion(e.target.value)}
                    />
                </div>
                <div>
                    <input
                        className='input-area'
                        type="text"
                        id="celular"
                        value={celular}
                        placeholder='Celular'
                        onChange={(e) => setCelular(e.target.value)}
                    />
                </div>
                <button className='navbar-button' type="submit" onClick={handleSubmit}>Enviar</button>
            </form>
            {approved}{errorMessage}</>
    );
}

function PedidosChart({ pedidos }: { pedidos: Pedido[] }) {
    return (
        <>
            <h1>PEDIDOS</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>
                            <span className="subtitle">ID</span>
                        </th>
                        <th>
                            <span className="subtitle">Fecha</span>
                        </th>
                        <th>
                            <span className="subtitle">ID Cliente</span>
                        </th>
                        <th>
                            <span className="subtitle">ID Platillo</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {pedidos.map((pedido) => (
                        <tr key={pedido["ID"]}>
                            <td>{pedido["ID"]}</td>
                            <td>{pedido["fecha"].toString()}</td>
                            <td>{pedido["id_cliente"]}</td>
                            <td>{pedido["id_platillo"]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};

function PlatillosChart({ platillos }: { platillos: Platillo[] }) {
    return (
        <>
            <h1>PLATILLOS</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>
                            <span className="subtitle">ID Pedido</span>
                        </th>
                        <th>
                            <span className="subtitle">Fecha</span>
                        </th>
                        <th>
                            <span className="subtitle">ID Platillo</span>
                        </th>
                        <th>
                            <span className="subtitle">ID Cliente</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {platillos.map((platillo) => (
                        <tr key={platillo["ID"]}>
                            <td>{platillo["nombre"]}</td>
                            <td>{platillo["precio"]}</td>
                            <td>{platillo["descripcion"]}</td>
                            <td>{platillo["categoria"]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};

function ClientesChart({ clientes }: { clientes: Cliente[] }) {
    return (
        <>
            <h1>CLIENTES</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>
                            <span className="subtitle">ID</span>
                        </th>
                        <th>
                            <span className="subtitle">Correo</span>
                        </th>
                        <th>
                            <span className="subtitle">Clave</span>
                        </th>
                        <th>
                            <span className="subtitle">Direccion</span>
                        </th>
                        <th>
                            <span className="subtitle">Celular</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {clientes.map((cliente) => (
                        <tr key={cliente["ID"]}>
                            <td>{cliente["ID"]}</td>
                            <td>{cliente["correo"]}</td>
                            <td>{cliente["clave"]}</td>
                            <td>{cliente["direccion"]}</td>
                            <td>{cliente["celular"]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};
