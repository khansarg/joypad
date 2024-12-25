
const Booking = () => {
    return (
        <div>
            <main>
            
                <h1>BOOKING FORM</h1>
            <div className="space-y-4">
                <div className="flex justify-between">
                    <span>Room      :</span>
                    <span>disini nama room</span>
                    <span>di sini harganya</span>
                </div>
                <div className="flex justify-between">
                    <span>Date      :</span>
                    <span>di sini tanggalnya</span>
                </div>
                <div className="flex justify-between">
                    <span>Time      :</span>
                    <span>di sini jamnya</span>
                </div>
                <div className="flex justify-between">
                    <span>Duration  :</span>
                    <span>di sini durasinya</span>
                    <span>(x1)</span>
                </div>
                <div className="flex justify-between">
                    <span>SUBTOTAL</span>
                    <span>di sini subtotalnya</span>
                </div>
            </div>
            <div className="flex justify-between mt-8">
                    <button>BACK</button>
                    <button>NEXT</button>
            </div>
            </main>
        </div>
    );
};

export default Booking;