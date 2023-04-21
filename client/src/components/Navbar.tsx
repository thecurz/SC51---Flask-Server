import logo from '../assets/logo.png'
export default function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-logo"><img src={logo} />
                <span>Terra Gourmet</span></div>
            <ul className="navbar-menu">
                <li><a href="/">HOME</a></li>
                <li><a href="/menu">MENU</a></li>
                <li><a href="/sobrenosotros">ABOUT</a></li>
                <li><a href="/contacto">CONTACT</a></li>
                <li><a href="/admin">ADMIN</a></li>
            </ul>
            <button className='navbar-button'>ORDER NOW</button>
        </nav>
    );
}