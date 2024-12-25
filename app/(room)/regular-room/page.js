'use client'

import { useState } from 'react';
import Header from "../../header";
import Footer from "../../footer";
import Link from 'next/link';
import "../../../styles/regular.css";

const RegularRoom = () => {
    const [activeSection, setActiveSection] = useState('facilities');

    const handleNavClick = (section, e) => {
        e.preventDefault();
        setActiveSection(section);
    };

    const renderContent = () => {
        if (activeSection === 'facilities') {
            return (
                <div className="features-container">
                    <div>
                        <img src="/image/produk-ps-5.png" alt="Playstation 5"/>
                        <h3>Playstation 5<br/>(2 Controllers)</h3>
                    </div>
                    <div>
                        <img src="/image/smart-tv.png" alt="4K Smart TV"/>
                        <h3>4K Smart TV<br/>55 inch</h3>
                    </div>
                    <div>
                        <img src="/image/cctv.png" alt="CCTV"/>
                        <h3>CCTV</h3>
                    </div>
                    <div>
                        <img src="/image/charge.png" alt="Charging Station"/>
                        <h3>Charging Station</h3>
                    </div>
                    <div>
                        <img src="/image/schedule.png" alt="Booking Schedule"/>
                        <h3>Booking Schedule</h3>
                    </div>
                    <div>
                        <img src="/image/wifi.png" alt="Wifi 300 mbps"/>
                        <h3>Wifi 300 mbps</h3>
                    </div>
                    <div>
                        <img src="/image/room.png" alt="Private Room"/>
                        <h3>Private Room</h3>
                    </div>
                    <div>
                        <img src="/image/ac.png" alt="Air Conditioner"/>
                        <h3>Air Conditioner</h3>
                    </div>
                    <div>
                        <img src="/image/psplus.png" alt="psplus"/>
                        <h3>PS Plus</h3>
                    </div>
                    <div>
                        <img src="/image/netflix.png" alt="netflix"/>
                        <h3>Netflix</h3>
                    </div>
                    <div>
                        <img src="/image/youtube.png" alt="youtube"/>
                        <h3>YouTube</h3>
                    </div>
                </div>
            );
        } else if (activeSection === 'exclusive-games') {
            return (
                <div className="games-container">
                    <div>
                        <img src="/image/exgame/astrobot.png" alt="Astro Bot"/>
                        <h3>Astro Bot</h3>
                    </div>
                    <div>
                        <img src="/image/exgame/wukong.png" alt="Black Myth Wukong"/>
                        <h3>Black Myth Wukong</h3>
                    </div>
                    <div>
                        <img src="/image/exgame/uncharted.png" alt="Uncharted : Legacy of Thieves Collection"/>
                        <h3>
                        Uncharted : Legacy of Thiev-<br />
                        es Collection
                        </h3>
                    </div>
                </div>    
            );
        }
    };

    return (
        <div>
            <Header/>
            <div>
                <div className="image-container">
                    <img src="/image/regular.png" alt="Regular" />
                </div>
                <div className="type">
                    <div className="room-info">
                        <h1 className="room-title">REGULAR ROOM</h1>
                        <p className="room-price">Rp. 20.000/hour</p>
                    </div>
                    <div>
                        <button className="book-btn">BOOK</button>
                    </div>
                </div>
                <div className="facilities">
                    <nav>
                        <ul>
                            <li>
                                <a 
                                    href="#" 
                                    id="facilities" 
                                    className={`nav-link ${activeSection === 'facilities' ? 'active' : ''}`}
                                    onClick={(e) => handleNavClick('facilities', e)}
                                >
                                    FACILITIES
                                </a>
                            </li>
                            <li>
                                <a 
                                    href="#" 
                                    id="exclusive-games" 
                                    className={`nav-link ${activeSection === 'exclusive-games' ? 'active' : ''}`}
                                    onClick={(e) => handleNavClick('exclusive-games', e)}
                                >
                                    EXCLUSIVE GAMES
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
                {renderContent()}
            </div>
            <Footer/>
        </div>
    );
};

export default RegularRoom;