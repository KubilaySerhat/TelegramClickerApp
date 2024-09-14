import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./index.css";
import Arrow from "./icons/Arrow";
import Profile from "./Profile";
import { coin, highVoltage, logo, rocket, trophy, trigonlogo } from "./images";
import axios from "axios";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
};

const HomePage = () => {
  const [points, setPoints] = useState<number>(() => {
    const savedPoints = localStorage.getItem("points");
    return savedPoints ? parseInt(savedPoints, 10) : 1;
  });

  const [energy, setEnergy] = useState<number>(() => {
    const savedEnergy = localStorage.getItem("energy");
    return savedEnergy ? parseInt(savedEnergy, 10) : 50;
  });

  const [clicks, setClicks] = useState<{ id: number; x: number; y: number }[]>(
    []
  );

  const [earnable, setPointsEarnable] = useState();
  const [currentPoint, setCurrentPoint] = useState<{ point: number }>();
  const [showErrorPopup, setShowErrorPopup] = useState(false); // Hata durumunda pop-up kontrolü
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Hata mesajı durumu
  const [errorTitle, setErrorTitle] = useState<string>("Bir hata oluştu!"); // Hata başlığı

  const getPointsEarnable = () => {
    axios
      .get("https://api.infinitex.space/trigon-telegram-point/earnable", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      })
      .then((e) => setPointsEarnable(e.data))
      .catch((error) => {
        console.error("Puan kazanma isteği başarısız:", error);
        // İsteğe bağlı olarak burada da hata işleme ekleyebilirsiniz
      });
  };

  const getCurrentPoint = () => {
    axios
      .get("https://api.infinitex.space/trigon-telegram-point", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      })
      .then((e) => {
        setCurrentPoint(e.data);
      })
      .catch((error) => {
        console.error("Mevcut puan alınamadı:", error);
        // İsteğe bağlı olarak burada da hata işleme ekleyebilirsiniz
      });
  };

  const earnPoint = () => {
    axios
      .post(
        "https://api.infinitex.space/trigon-telegram-point/earn",
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("accessToken"),
          },
        }
      )
      .then((e) => {
        if (e.status === 200) {
          setPoints((prevPoints) => {
            const newPoints = prevPoints + 100;
            localStorage.setItem("points", newPoints.toString());
            return newPoints;
          });
        }
        getCurrentPoint();
      })
      .catch((error) => {
        console.error("Puan kazanma isteği başarısız:", error);
        if (error.response && error.response.data) {
          if (error.response.data.message === "Unauthorized") {
            setErrorMessage("You need to Login! use: Profile -> Login");
            setErrorTitle("Authorization Error");
          } else {
            setErrorMessage(error.response.data.message);
            setErrorTitle("Sorry!");
          }
        } else {
          setErrorMessage("Bilinmeyen bir hata oluştu.");
          setErrorTitle("Bir hata oluştu!");
        }
        setShowErrorPopup(true);
      });
  };

  const pointsToAdd = 1;
  const energyToReduce = 1;
  const maxEnergy = 100;

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (energy - energyToReduce < 0) {
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPoints((prevPoints) => {
      const newPoints = prevPoints + pointsToAdd;
      localStorage.setItem("points", newPoints.toString());
      return newPoints;
    });

    setEnergy((prevEnergy) => {
      const newEnergy = Math.max(0, prevEnergy - energyToReduce);
      localStorage.setItem("energy", newEnergy.toString());
      return newEnergy;
    });

    setClicks([...clicks, { id: Date.now(), x, y }]);
  };

  const handleAnimationEnd = (id: number) => {
    setClicks((prevClicks) => prevClicks.filter((click) => click.id !== id));
  };

  useEffect(() => {
    getPointsEarnable();
    getCurrentPoint();

    const interval = setInterval(() => {
      setEnergy((prevEnergy) => {
        const newEnergy = Math.min(prevEnergy + 1, maxEnergy);
        localStorage.setItem("energy", newEnergy.toString());
        return newEnergy;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-main min-h-screen px-4 flex flex-col items-center text-white font-medium">
      {showErrorPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-yellow-200 text-black p-8 rounded-md">
            <h2 className="text-xl font-bold mb-4">{errorTitle}</h2>
            <p>{errorMessage}</p>
            {errorMessage === "You need to Login! use: Profile -> Login" && (
              <Link to="/profile" className="text-blue-500 underline mt-2 block">
                Go to Profile
              </Link>
            )}
            <button
              className="mt-4 px-4 py-2 bg-yellow-500 text-black rounded"
              onClick={() => setShowErrorPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="absolute inset-0 h-1/2 bg-gradient-overlay z-0"></div>
      <div className="absolute inset-0 flex items-center justify-center z-0">
        <div className="radial-gradient-overlay"></div>
      </div>

      <div className="w-full z-10 min-h-screen flex flex-col items-center text-white">
        <div className="fixed top-0 left-0 w-full px-4 pt-8 z-10 flex flex-col items-center text-white">
          <div className="mt-12 text-5xl font-bold flex items-center">
            <img src={coin} width={44} height={44} alt="Coin" />
            <span className="ml-2">
              {(currentPoint?.point ?? 0).toLocaleString()}
            </span>
          </div>
          <div className="text-base mt-2 flex items-center">
            <img src={trophy} width={24} height={24} alt="Trophy" />
            <span className="ml-1">
              Gold <Arrow size={18} className="ml-0 mb-1 inline-block" />
            </span>
          </div>
        </div>

        <div className="flex-grow flex flex-col items-center justify-center">
          <div className="relative mt-4" onClick={earnPoint}>
            <img src={logo} width={256} height={256} alt="Logo" />
            {clicks.map((click) => (
              <div
                key={click.id}
                className="absolute text-5xl font-bold opacity-0"
                style={{
                  top: `${click.y - 42}px`,
                  left: `${click.x - 28}px`,
                  animation: `float 1s ease-out`,
                }}
                onAnimationEnd={() => handleAnimationEnd(click.id)}
              >
                +{pointsToAdd}
              </div>
            ))}
          </div>
        </div>

        <div className="fixed bottom-0 left-0 w-full px-4 pb-4 z-10">
          <div className="w-full flex justify-between gap-2">
            <div className="w-1/2 flex items-center justify-start max-w-32">
              <div className="flex items-center justify-center">
                <img
                  src={highVoltage}
                  width={44}
                  height={44}
                  alt="High Voltage"
                />
                <div className="ml-2 text-left">
                  <span className="text-white text-2xl font-bold block">
                    {energy}
                  </span>
                  <span className="text-white text-large opacity-75">
                    / {maxEnergy}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex-grow flex items-center max-w-60 text-sm">
              <div className="w-full bg-[#fad258] py-4 rounded-2xl flex justify-around">
                <Link
                  to="/profile"
                  className="flex flex-col items-center gap-1"
                >
                  <img src={trigonlogo} width={24} height={24} alt="Profile" />
                  <span>Profile</span>
                </Link>
                <div className="h-[48px] w-[2px] bg-[#fddb6d]"></div>
                <button className="flex flex-col items-center gap-1">
                  <img src={rocket} width={24} height={24} alt="Boosts" />
                  <span>Boosts</span>
                </button>
              </div>
            </div>
          </div>
          <div className="w-full bg-[#f9c035] rounded-full mt-4">
            <div
              className="bg-gradient-to-r from-[#f3c45a] to-[#fffad0] h-4 rounded-full"
              style={{ width: `${(energy / maxEnergy) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
