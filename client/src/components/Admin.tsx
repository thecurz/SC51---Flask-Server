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
    //TODO: Implement the menu for posting and updating a plate
    return <div>Admin menu for posting and updating a plate</div>;
}