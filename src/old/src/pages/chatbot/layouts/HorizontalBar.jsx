import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";

import { useAuth } from "../AuthContext";
import NewAuthService from "../services/auth-service";

import profile from "../../../assets/img/chatbot/user/profile.png";
import style from "./HorizontalBar.module.scss";

export default function HorizontalBar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const Navigate = useNavigate();
    const { currentUser, setCurrentUser } = useAuth();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        NewAuthService.logout();
        setCurrentUser(null);
        Navigate("/login");
    };

    return (
        <div className="flex justify-between shadow-[0_2px_4px_0_rgba(0,0,0,0.1)] px-[20px] ms-[-40px] fixed w-[85%] bg-white z-20 top-0 me-0 ms-auto">
            <ul className={`flex justify-around ${style.ul}`}>
                <li>
                    <Link to="/chatbot/document/1" className="hover:text-blue-600 transition-colors">Document</Link>
                </li>
                {/* <li>
                    <Link to="/file" className="hover:text-blue-600 transition-colors">File</Link>
                </li>
                <li>
                    <Link to="/setting" className="hover:text-blue-600 transition-colors">Setting</Link>
                </li> */}
                <li>
                    <Link to="/help" className="hover:text-blue-600 transition-colors">Help</Link>
                </li>
            </ul>
            <div className="relative" ref={menuRef}>
                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center space-x-2 focus:outline-none me-4"
                >
                    <div className="w-[42px] h-[42px] rounded-full my-[9px] overflow-hidden">
                        <img src={profile} alt="user profile" className="w-full h-full object-cover"/>
                    </div>
                </button>
                
                {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                        {/* <Link
                            to="/profile"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                            <User size={16} className="mr-2" />
                            Profile
                        </Link> */}
                        <button
                            onClick={handleLogout}
                            className={`w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors`} >
                            <LogOut size={16} className="mr-2" />
                            Log out
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}