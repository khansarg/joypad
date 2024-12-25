import "../styles/footer.css";
import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-left">
                {/* Logo Footer */}
                <img
                    src="/image/Journey 1.png"
                    alt="Footer Logo"
                    className="footer-logo"
                />
                {/* Hak Cipta */}
                <div className="footer-info">
                    <span>© 2024 Joypad Journey. All Rights Reserved.</span>
                </div>

                <div className="aturan">
                    <a href="/" className="privacy-police">Privacy Police</a>
                    <a href="/" className="terms-and-condi">Terms and Condition</a>
                </div>
            </div>

            <div className="footer-center">
                {/* Alamat */}
                <div className="footer-address">
                    <span>Jl. Terusan Buah Batu No. 22, Bandung, Indonesia</span>
                </div>
            </div>

            <div className="footer-right">
                {/* Ikon Kontak */}
                <div className="footer-icons">
                    <div className="footer-icon">
                        <a href="mailto:joypadjourney@gmail.com">
                            <img src="/image/gmail.jpg" alt="Gmail Logo" />
                            <p>joypadjourney@gmail.com</p>
                        </a>
                    </div>    
                    <div className="footer-icon">
                        <a href="https://instagram.com/joypad.journey" target="_blank">
                            <img src="/image/insta.jpg" alt="Instagram Logo" />
                            <p>@joypad.journey</p>
                        </a>
                    </div>        
                    <div className="footer-icon">
                        <a href="https://wa.me/6282217287504" target="_blank">
                            <img src="/image/whatsapp.jpg" alt="WhatsApp Logo" />
                            <p>+62822172787504</p>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
