import Header from "../../header";
import Footer  from "../../footer";
import Link from 'next/link';
import "../../../styles/find-room.css"

const findRoom = () => {
    return (
        <div>
            <Header/>
            <div>
                {/* Bagian Reservation */}
                <section id="reservation" className="section">
                    <div className="reservation-box">
                        <div className="input-group">
                            <label>Reservation date</label>
                            <input type="date" placeholder="Add dates" />
                        </div>
                        <div className="input-group">
                            <label>Reservation time</label>
                            <input type="time" placeholder="Add times" />
                        </div>
                            <button id="find" className="find-room-button">
                            <Link href="/find-room" className="find-room-link">Find Room</Link>
                        </button>
                    </div>
                </section>
            </div>
            <div className="room-container">
                <div>
                    <img src="/image/regularfind.png" alt="regular room"/>
                    <h3>REGULAR ROOM</h3>
                    <Link href="/regular-room">
                        <div className="Expand-btn">Expand</div>
                    </Link>  
                </div>
                <div>       
                    <img src="/image/vipfind.png" alt="vip room"/>
                    <h3>VIP ROOM</h3>
                    <div>
                        <Link href="/vip-room">
                            <div className="Expand-btn2">Expand</div>
                        </Link> 
                    </div>  
                </div>
                <div>
                    <img src="/image/vvipfind.png" alt="vvip room"/>
                    <h3>VVIP ROOM</h3>
                    <div>
                        <Link href="/vvip-room">
                            <div className="Expand-btn3">Expand</div>
                        </Link>  
                    </div>
                </div>
            </div>
            
            <Footer/>
        </div>
    );
};

export default findRoom;
