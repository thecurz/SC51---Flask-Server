import {Navbar, Footer} from "."
import { useState, useEffect } from 'react'
import { API_URL } from "."
export default function Menu() {
    return (<div>
        <Navbar />
        <PlateContainer />
        <Footer /></div>)
}

const fetchData = async () => {
    //TODO: change url for production
    const data = await fetch(API_URL + "/GET/platillo").then(res => res.json());
    return data;
}

function PlateContainer() {
    const [platos, setPlatos] = useState<JSX.Element[]>([]);

    useEffect(() => {
        if (platos.length === 0) {
            (async () => {
                var data_array = await fetchData();
                var platoArray = [];
                for (let i = 0; i < data_array.length; i++) {
                    var plato = data_array[i];
                    platoArray.push(<Plate
                        nombre={plato.nombre}
                        descripcion={plato.descripcion}
                        categoria={plato.categoria}
                        precio={plato.precio}
                        key={plato.ID} />)
                }
                setPlatos([...platoArray]);
            })();
        }
    }, []);
    return (
        <div className="plate-container">
            <h1>Nuestros platos</h1>
            <div className="plates">{platos}</div>
        </div>
    );
}

function Plate({ nombre, descripcion, categoria, precio }:
    { nombre: string, descripcion: string, categoria: string, precio: string }) {
    return (
        <div className="plate">
            <h2 className="plate-title">{nombre}</h2>
            <p className="plate-description">{descripcion}</p>
            <div className="plate-category">{categoria}</div>
            <div className="plate-price">{precio}</div>
        </div>
    );
}