import { signOut ,onAuthStateChanged} from "firebase/auth";
import { NETFLIX_LOGO } from "../constants/Images";
import {useSelector} from "react-redux"
import { auth } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import { addUser, removeUser } from "../utils/Slices/userSlice";
import {useDispatch,} from 'react-redux'
import { useEffect } from "react";
import { toggleShowGptSearch } from "../utils/Slices/gptSlice";
import { SUPPORTED_LANGUAGES } from "../constants/constants";

import { addUserLanguage } from "../utils/Slices/languageConfigSlice";



const Header=()=>
{
    const showGptSearchKey=useSelector((store)=>store.gpt.showGptSearch)

    const navigate=useNavigate()
    const handleSignOut=()=>
    {
        signOut(auth)
        .then()
        .catch((error) => {
          navigate("/error");
        });
    }
    const user=useSelector((store)=>store.user);
    const dispatch=useDispatch()
    useEffect(()=>
        {
          onAuthStateChanged(auth, (user) => {
            if (user) {
              const {uid,displayName,photoURL,email} = user;
              dispatch(addUser({uid:uid,displayName:displayName ,photoURL:photoURL,email:email}))
              navigate('/browse')
              // ...
            } else {
              dispatch(removeUser())
              navigate('/')
              // User is signed out
              // ...
            }
          });
        },[])

    const handleGptToggle=()=>
    {
      dispatch(toggleShowGptSearch())
    }
    const handleLanguageChange=(e)=>
    {
      dispatch(addUserLanguage(e.target.value));
    }

    return(
        <>
        <div className="fixed w-screen bg-gradient-to-b z-10 from-black flex flex-row justify-between  max-sm:flex max-sm:flex-col">
            <div>
                <img className="w-44 max-sm:mx-auto" src={NETFLIX_LOGO} alt="netflix_logo"/>    
            </div>
        {user &&
            <div className="flex items-center max-sm:flex max-sm:justify-around"> 
            {
              showGptSearchKey && 
              <select onChange={handleLanguageChange} className="px-3 py-1 mr-3 bg-slate-500 rounded-lg text-white focus:outline-none">
              {SUPPORTED_LANGUAGES.map((lang)=> <option value={lang.value}> {lang.identfier}</option>)}
              </select>

            }
                <button onClick={handleGptToggle} className="bg-blue-700 text-white rounded-lg px-3 py-1 h-8 text-center">{showGptSearchKey ? "Homepage" :"GPT Search"}</button>
                <img className="w-10 m-4 h-10 rounded-xl max-sm:hidden" src={user.photoURL} alt="dummy"></img>
                <button onClick={handleSignOut} className="text-white font-bold mr-8">Sign out </button>
            </div>}
        </div>
        </>
    )
}

export default Header