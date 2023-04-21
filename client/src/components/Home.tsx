import Footer from "./Footer";
import Navbar from "./Navbar";


export default function Index() {
    return (
        <div className="app">
            <Navbar />
            <Hero />
            <Footer />
        </div>
    );
}

function Hero() {
    return (
        <section>
            <div className="hero">
                <div className="hero-img"></div>
                <button className="hero-button">MENU</button>
            </div>

        </section>
    );
}
