import "./index.css";
import logo from "./images/logo.png";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";

interface DecodedToken {
  id: string;
  email: string;
  // Diğer gerekli alanlar
  token: string;
}

const Profile = () => {
  const [showLoginPopup, setShowLoginPopup] = useState(false); // Login pop-up kontrolü
  const [showErrorPopup, setShowErrorPopup] = useState(false); // Hata pop-up kontrolü
  const [email, setEmail] = useState(""); // Mail state'i
  const [password, setPassword] = useState("");
  const [points, setPoints] = useState(0); // Points state'i
  const [user, setUser] = useState<DecodedToken | null>(null); // Kullanıcı bilgilerini saklamak için state
  const navigate = useNavigate(); // Navigate Hook'u

  const handleLoginClick = () => {
    setShowLoginPopup(true); // Login pop-up'ı aç
  };

  const getCurrentPoint = () => {
    axios
      .get("https://api.infinitex.space/trigon-telegram-point", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      })
      .then((e) => {
        setPoints(e.data.point);
      })
      .catch((err) => {
        console.error("Puan alınırken bir hata oluştu:", err);
        // Gerekirse hata yönetimi yapın
      });
  };

  const extractJwt = (accessToken: string) => {
    try {
      const decodedToken: DecodedToken = jwtDecode(accessToken);
      decodedToken.token = accessToken;
      setUser(decodedToken);
    } catch (error) {
      console.error("Token decode hatası:", error);
      // Gerekirse hata yönetimi yapın
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      extractJwt(token);
      getCurrentPoint();
    }
  }, []);

  const handleLoginSubmit = () => {
    axios
      .post("https://api.infinitex.space/auth/login", { email, password })
      .then((response) => {
        localStorage.setItem("accessToken", response.data.access_token);
        localStorage.setItem("refreshToken", response.data.refresh_token);
        extractJwt(response.data.access_token);

        // Login popup'ını kapat
        setShowLoginPopup(false);

        // Puanları almak için API çağrısını yap
        getCurrentPoint();

        // İsteğe bağlı: Kullanıcıyı yönlendirin
        navigate("/profile");
      })
      .catch((err) => {
        console.error("Giriş sırasında bir hata oluştu:", err);
        setShowLoginPopup(false);
        setShowErrorPopup(true);
      });
  };

  return (
    <div className="bg-gradient-main min-h-screen px-4 flex flex-col items-center text-white font-medium">
      <div className="absolute inset-0 h-1/2 bg-gradient-overlay z-0"></div>
      <div className="absolute inset-0 flex items-center justify-center z-0">
        <div className="radial-gradient-overlay"></div>
      </div>

      <div className="w-full z-10 min-h-screen flex flex-col items-center text-white relative">
        <div className="mt-24 flex flex-col items-center text-center">
          <div className="text-5xl font-bold flex items-center justify-center">
            <img src={logo} width={44} height={44} alt="Logo" />
            <span className="ml-2">Profile</span>
          </div>
        </div>

        <div className="mt-12 w-full max-w-[12.5rem] flex flex-col items-center space-y-12">
          <div className="w-full text-center">
            <label className="block text-2xl font-bold mb-2">ID:</label>
            <div className="w-full px-4 py-2 text-black bg-[#fad258] bg-opacity-50 rounded-lg">
              {user?.id || "123456"}
            </div>
          </div>
          <div className="w-full text-center">
            <label className="block text-2xl font-bold mb-2">Mail:</label>
            <div className="w-full px-4 py-2 text-black bg-[#fad258] bg-opacity-50 rounded-lg">
              {user?.email}
            </div>
          </div>
          <div className="w-full text-center">
            <label className="block text-2xl font-bold mb-2">Points:</label>
            <div className="w-full px-4 py-2 text-black bg-[#fad258] bg-opacity-50 rounded-lg">
              {points}
            </div>
          </div>
        </div>

        <div className="mt-12 w-full max-w-[12.5rem]">
          <button
            className="w-full px-4 py-3 bg-[#fad258] text-white rounded-lg font-bold text-lg text-center"
            onClick={handleLoginClick} // Login pop-up
          >
            Login
          </button>
        </div>

        <div className="w-full flex justify-center absolute bottom-8">
          <Link
            to="/"
            className="bg-[#fad258] text-white w-3/4 py-3 rounded-lg font-bold text-lg border border-white text-center"
          >
            HOME
          </Link>
        </div>
      </div>

      {showLoginPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-yellow-200 text-black p-8 rounded-md w-80">
            <h2 className="text-xl font-bold mb-4">Login</h2>
            <div className="mb-4">
              <label className="block text-lg font-bold mb-2">Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white text-black"
                placeholder="Email"
              />
            </div>
            <div className="mb-4">
              <label className="block text-lg font-bold mb-2">Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white text-black"
                placeholder="Password"
              />
            </div>
            <div className="flex justify-between">
              <button
                className="mt-4 px-4 py-2 bg-yellow-500 text-black rounded"
                onClick={handleLoginSubmit} // Giriş bilgilerini gönder
              >
                Submit
              </button>
              <button
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
                onClick={() => setShowLoginPopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showErrorPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-red-200 text-black p-8 rounded-md w-80">
            <h2 className="text-xl font-bold mb-4">Sorry!</h2>
            <p>E-mail and password didn't match.</p>
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
              onClick={() => setShowErrorPopup(false)} // Hata pop-up'ını kapat
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
