import "../styles/header.css";
import Link from 'next/link';

const Header = () => {
    return (
        <header>
        <div className="navbar">
            <div className="logo">
                <img src="/image/Journey 1.png" alt="Logo Website"/>
            </div>
            <nav>
                <ul>
                    <li><a href="/" id="home" className="nav-link active">Home</a></li>
                    <li><a href="#" id="myReservation" className="nav-link">My Reservation</a></li>
                    <li><Link href="/review" id="review" className="nav-link">Review</Link></li>
                </ul>
            </nav>
        </div>
        <nav>
            <ul>
                <div className="profile-container">
                    <div className="profile">
                        <img className="profile-circle" src="/image/user.png" alt="Profile Picture"/>
                    </div>
                </div>
                <div className=" user-profile">
                    <li> 
                        <a className="username" id="username">Khansarz </a>
                    </li>
                </div>
            </ul>
        </nav>
    </header>
    );
};

export default Header;
