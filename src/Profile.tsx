import './index.css';
import logo from './images/logo.png';  // logo.png'yi import ediyoruz
import { Link } from 'react-router-dom';

const Profile = () => {
  return (
    <div className="bg-gradient-main min-h-screen px-4 flex flex-col items-center text-white font-medium">
      <div className="absolute inset-0 h-1/2 bg-gradient-overlay z-0"></div>
      <div className="absolute inset-0 flex items-center justify-center z-0">
        <div className="radial-gradient-overlay"></div>
      </div>

      <div className="w-full z-10 min-h-screen flex flex-col items-center text-white relative">
        <div className="mt-24 flex flex-col items-center text-center">
          <div className="text-5xl font-bold flex items-center justify-center">
            <img src={logo} width={44} height={44} alt="Logo" />  {/* logo.png ile değiştirdik */}
            <span className="ml-2">Profile</span>
          </div>
        </div>

        <div className="mt-12 w-full max-w-[12.5rem] flex flex-col items-center space-y-12">
          <div className="w-full text-center">
            <label className="block text-2xl font-bold mb-2">ID:</label>
            <div
              className="w-full px-4 py-2 text-black bg-[#fad258] bg-opacity-50 rounded-lg"
            >
              123456
            </div>
          </div>
          <div className="w-full text-center">
            <label className="block text-2xl font-bold mb-2">Mail:</label>
            <div
              className="w-full px-4 py-2 text-black bg-[#fad258] bg-opacity-50 rounded-lg"
            >
              example@mail.com
            </div>
          </div>
          <div className="w-full text-center">
            <label className="block text-2xl font-bold mb-2">Points:</label>
            <div
              className="w-full px-4 py-2 text-black bg-[#fad258] bg-opacity-50 rounded-lg"
            >
              1000
            </div>
          </div>
        </div>

        <div className="w-full flex justify-center absolute bottom-8">
          <Link to="/" className="bg-[#fad258] text-white w-3/4 py-3 rounded-lg font-bold text-lg border border-white text-center"> {/* HOME butonuna beyaz çerçeve ekledik */}
            HOME
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
