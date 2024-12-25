'use client'

import { useState } from 'react';
import Header from "../../header";
import Footer from "../../footer";
import Link from 'next/link';
import "../../../styles/vip.css";

const VipRoom = () => {
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
                    <img 
                        style={{ marginTop: "40px" }} 
                        src="/image/produk-ps-5.png" 
                        alt="Playstation 5" 
                        />
                        <h3>
                        Playstation 5<br />
                        (2 Controllers)
                        </h3>
                    </div>
                    <div>
                        <img style={{ marginTop: "40px" }} src="/image/smart-tv.png" alt="4K Smart TV" />
                        <h5>4K Smart TV 55 inch</h5>
                    </div>
                    <div>
                        <img style={{ marginBottom: "40px" }} src="/image/cctv.png" alt="CCTV" />
                        <h4>CCTV</h4>
                    </div>
                    <div>
                        <img
                        style={{ width: "152px", height: "152px" }}
                        src="/image/charge.png"
                        alt="Charging Station"
                        />
                        <h3>Charging Station</h3>
                    </div>
                    <div>
                        <img src="/image/schedule.png" alt="Booking Schedule" />
                        <h3>Booking Schedule</h3>
                    </div>
                    <div>
                        <img src="/image/wifi.png" alt="Wifi 300 mbps" />
                        <h3>Wifi 300 mbps</h3>
                    </div>
                    <div>
                        <img src="/image/room.png" alt="Private Room" />
                        <h3>Private Room</h3>
                    </div>
                    <div>
                        <img src="/image/ac.png" alt="Air Conditioner" />
                        <h3>Air Conditioner</h3>
                    </div>
                    <div>
                        <img
                        style={{ width: "150px", height: "150px" }}
                        src="/image/console.png"
                        alt="Nintendo Switch"
                        />
                        <h3>
                        Nintendo Switch <br />
                        (2 Controllers)
                        </h3>
                    </div>
                    <div>
                        <img
                        style={{ verticalAlign: "top" }}
                        src="/image/psplus.png"
                        alt="PS Plus"
                        />
                    </div>
                    <div>
                        <img src="/image/netflix.png" alt="Netflix" />
                    </div>
                    <div>
                        <img src="/image/youtube.png" alt="YouTube" />
                    </div>
                </div>
            );
        } else if (activeSection === 'exclusive-games') {
            return (
                <div className="games-container">
                    <div>
                        <img src="/image/exgame/spider.png" alt="Marvel’s Spider-Man: Miles Moarales"/>
                        <h3>
                            Marvel’s Spider-Man: Miles-<br />
                            Moarales
                        </h3>
                    </div>
                    <div>
                        <img src="/image/exgame/fortnite.png" alt="Fortnite"/>
                        <h3>Fortnite</h3>
                    </div>
                    <div>
                        <img src="/image/exgame/ragnarok.png" alt="God of War Ragnarok"/>
                        <h3>God of War Ragnarok</h3>
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
                    <img src="/image/vip.png" alt="Vip" />
                </div>
                <div className="type">
                    <div className="room-info">
                        <h1 className="room-title">VIP ROOM</h1>
                        <p className="room-price">Rp. 35.000/hour</p>
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

export default VipRoom;







