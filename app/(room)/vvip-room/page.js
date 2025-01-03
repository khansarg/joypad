'use client'

import { useState, useEffect } from 'react';
import Header from "../../header";
import Footer from "../../footer";
import Link from 'next/link';
import "../../../styles/vvip.css";

const VvipRoom = () => {
    const [activeSection, setActiveSection] = useState('facilities');
    const [roomDetails, setRoomDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [startDateTime, setStartDateTime] = useState("");
    const [endDateTime, setEndDateTime] = useState("");

    const handleNavClick = (section, e) => {
        e.preventDefault();
        setActiveSection(section);
    };
    useEffect(() => {
            const startDateTime = localStorage.getItem("startDateTime");
            const endDateTime = localStorage.getItem("endDateTime");
            if (startDateTime && endDateTime) {
                setStartDateTime(startDateTime);
                setEndDateTime(endDateTime);
                console.log("Start DateTime:", startDateTime);
                console.log("End DateTime:", endDateTime);
              } else {
                console.warn("Missing startDateTime or endDateTime in query parameters.");
              }
            const fetchRoomDetails = async () => {
              try {
                const response = await fetch("https://joypadjourney-be-production.up.railway.app/api/reservations/room-details?roomName=VVIP", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`, // Pastikan token disimpan di localStorage
                    "Content-Type": "application/json",
                  },
                });
                if (!response.ok) throw new Error("Failed to fetch room details");
        
                const data = await response.json();
                setRoomDetails(data);
              } catch (err) {
                setError(err.message);
              } finally {
                setLoading(false);
              }
            };
        
            fetchRoomDetails();
          }, []);
          if (loading) return <div>Loading room details...</div>;
          if (error) return <div>Error: {error}</div>;

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
                    (4 Controllers)
                    </h3>
                </div>
                <div>
                    <img
                    style={{ marginTop: "40px" }}
                    src="/image/smart-tv.png"
                    alt="4K Smart TV"
                    />
                    <h5>4K Smart TV 86 inch</h5>
                </div>
                <div>
                    <img
                    style={{ width: "100px", height: "100px", marginTop: "25px" }}
                    src="/image/console.png"
                    alt="Nintendo Switch"
                    />
                    <h6>
                    Nintendo Switch<br />
                    (4 Controllers)
                    </h6>
                </div>
                <div>
                    <img
                    style={{ marginTop: "37px" }}
                    src="/image/ac.png"
                    alt="Air Conditioner"
                    />
                    <h3>Air Conditioner</h3>
                </div>
                <div>
                    <img
                    style={{ marginBottom: "40px" }}
                    src="/image/cctv.png"
                    alt="CCTV"
                    />
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
                    <img src="/image/room.png" alt="Private Room" />
                    <h3>Private Room</h3>
                </div>
                <div>
                    <img src="/image/audio.png" alt="Soundbar" />
                    <h3>Soundbar</h3>
                </div>
                <div>
                    <img src="/image/wifi.png" alt="Wifi 300 mbps" />
                    <h3>Wifi 300 mbps</h3>
                </div>
                <div>
                    <img src="/image/schedule.png" alt="Booking Schedule" />
                    <h3>Booking Schedule</h3>
                </div>
                <div>
                    <img src="/image/boardgms.png" alt="Board Games" />
                    <h3>Board Games</h3>
                </div>
                <div>
                    <img src="/image/dolby.png" alt="Dolby Atmos" />
                </div>
                <div>
                    <img
                    style={{ verticalAlign: "top" }}
                    src="/image/psplus.png"
                    alt="PS Plus"
                    />
                </div>
                <div>
                    <img src="/image/youtube.png" alt="YouTube" />
                </div>
                <div>
                    <img src="/image/prime.png" alt="Prime Video" />
                </div>
                <div>
                    <img src="/image/netflix.png" alt="Netflix" />
                </div>
                </div>
            );
        } else if (activeSection === 'exclusive-games') {
            return (
                <>
                    <div className="games-container">
                        <div>
                            <img src="/image/exgame/spider2.png" alt="Marvel's Spider-Man 2"/>
                            <h3>Marvel's Spider-Man 2</h3>
                        </div>
                        <div>
                            <img src="/image/exgame/ragnarok.png" alt="God of War Ragnarok"/>
                            <h3>God of War Ragnarok</h3>
                        </div>
                        <div>
                            <img src="/image/exgame/horizon.png" alt="Horizon Forbidden West"/>
                            <h3>Horizon Forbidden West</h3>
                        </div>
                        <div>
                            <img src="/image/exgame/thelast.png" alt="The Last of Us Part I"/>
                            <h3>The Last of Us Part I</h3>
                        </div>
                    </div>
                    <div className="games-container2">
                        <div>
                            <img src="/image/exgame/stellar.png" alt="Stellar Blade"/>
                            <h3>Stellar Blade</h3>
                        </div>
                    </div>
                    <div className="space"></div>
                </>
            );
        }
    };

    return (
        <div>
            <Header/>
            <div>
                <div className="image-container">
                    <img src="/image/vvip.png" alt="Vvip" />
                </div>
                <div className="type">
                    <div className="room-info">
                        <h1 className="room-title">VVIP ROOM</h1>
                        <p className="room-price">Rp. {roomDetails.pricePerHour.toLocaleString("id-ID")}/hour</p>
                    </div>
                    <div>
                        <Link href="/booking-form">
                            <button className="book-btn" onClick={() => {
                                const roomName = "VVIP";
                                localStorage.setItem("roomName", roomName);
                                const query = `?roomName=${roomName}&startDateTime=${startDateTime}&endDateTime=${endDateTime}`;
                                window.location.href = `/bookingformpromo${query}`;
                                }}>BOOK</button>
                        </Link>  
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

export default VvipRoom;














