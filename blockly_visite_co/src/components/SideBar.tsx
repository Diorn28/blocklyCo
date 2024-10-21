import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/Store';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/SideBar.css';

interface SidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
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
        <>
            <button
                className="btn btn-dark toggle-btn"
                onClick={toggleSidebar}
                style={{ right: isOpen ? '260px' : '15px' }}
            >
                {isOpen ? '→' : '←'}
            </button>

            <div className={`sidebar bg-light ${isOpen ? 'open' : 'closed'}`}>
                <h3 className="text-center">Navigation</h3>
                <Link to="/" className="btn btn-dark w-100 mb-3">Menu principal</Link>
                <Link to="/progress" className="btn btn-info w-100 mb-3">Avancement</Link>

                {progress.map((_, index) => (
                    <Link
                        key={index}
                        to={progress[index] || (index === 0 || progress[index - 1]) ? `/exercice${index + 1}` : '#'}
                        className={`${getButtonClass(index)} w-100 mb-2`}
                    >
                        {`Exercice ${index + 1}`}
                    </Link>
                ))}
            </div>
        </>
    );
};

export default Sidebar;

