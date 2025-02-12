import React, {useState} from 'react';
import {BrowserRouter as Router, Routes, Route, Link, useLocation} from 'react-router-dom';
import Exercice1 from './screen/exercices/Exercice1';
import ProgressPage from './screen/ProgressPage';
import SideBar from './components/SideBar';
import './App.css';
import Sidebar from "./components/SideBar";
import {useSelector} from "react-redux";
import {RootState} from "./redux/Store";
import "./style/HomePage.css"
import Exercice2 from "./screen/exercices/Exercice2";
import Exercice3 from "./screen/exercices/Exercice3";
import Exercice4 from "./screen/exercices/Exercice4";

const HomePage = () => {
    const progress = useSelector((state: RootState) => state.exercises.progress);

    const getButtonClass = (index: number): string => {
        if (progress[index]) {
            return 'btn btn-success';
        } else if (index === 0 || progress[index - 1]) {
            return 'btn btn-primary';
        } else {
            return 'btn btn-secondary disabled';
        }
    };

    return (
        <div className="container text-center mt-5">
            {/* Phrase d'apprentissage seulement sur la page d'accueil */}
            <h1>Apprentissage de la programmation avec Blockly!</h1>
            <p className="description mb-4">
                Vous avez ci-dessous quatres exercices permettant de comprendre la base de la logique de la programmation. Chaque exercice vous permettra de débloquer un bout de code pour une application Python.
            </p>

            {/* Boutons pour accéder aux exercices avec la logique d'accès */}
            <div className="d-flex justify-content-center flex-wrap">
                {progress.map((_, index) => (
                    <Link
                        key={index}
                        to={progress[index] || (index === 0 || progress[index - 1]) ? `/exercice${index + 1}` : '#'}
                        className={`${getButtonClass(index)} mx-2 my-2 px-4 py-2`}
                    >
                        {`Exercice ${index + 1}`}
                    </Link>
                ))}
            </div>

            {/* Lien pour voir l'avancement */}
            <div className="mt-4">
                <Link to="/progress" className="btn btn-info px-4 py-2">Voir Avancement</Link>
            </div>
        </div>
    );
};



const App = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation(); // Hook pour obtenir la route actuelle

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Condition pour afficher ou masquer la sidebar sur la page d'accueil
    const isHomePage = location.pathname === '/';

    return (
        <>
            {/* Header avec logo visible partout */}
            <header className="d-flex justify-content-center align-items-center p-3 bg-light shadow-sm">
                <Link to="/">
                    <img src="logo192.png" alt="Logo" className="logo" style={{width: '50px', height: 'auto'}}/>
                </Link>
            </header>


            <div className="d-flex">
                {!isHomePage && ( // Afficher la sidebar seulement si ce n'est pas la page d'accueil
                    <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar}/>
                )}
                <div className={`main-content container-fluid ${sidebarOpen && !isHomePage ? 'content-shift' : ''}`}>
                    <Routes>
                        <Route path="/" element={<HomePage/>}/>
                        <Route path="/exercice1" element={<Exercice1/>}/>
                        <Route path="/exercice2" element={<Exercice2/>}/>
                        <Route path="/exercice3" element={<Exercice3/>}/>
                        <Route path="/exercice4" element={<Exercice4/>}/>
                        <Route path="/progress" element={<ProgressPage/>}/>
                    </Routes>
                </div>
            </div>
        </>
    );
};

const AppWrapper = () => {
    return (
        <Router basename="/">
            <App/>
        </Router>
    );
};

export default AppWrapper;
