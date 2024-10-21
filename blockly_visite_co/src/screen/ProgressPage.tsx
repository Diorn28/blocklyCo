import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/Store';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProgressPage: React.FC = () => {
    const { progress, codeFragments } = useSelector((state: RootState) => state.exercises);

    return (
        <div className="container mt-5">
            <h2 className="mb-4 text-center">Avancement des Exercices</h2>
            <div className="row">
                {progress.map((completed, index) => (
                    <div key={index} className="col-md-6 mb-4">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Exercice {index + 1}</h4>
                                <span className={`badge ${completed ? 'bg-success' : 'bg-secondary'} mb-3`}>
                                    {completed ? 'Terminé' : 'Non terminé'}
                                </span>
                                {completed && (
                                    <>
                                        <h6>Fragment de code débloqué :</h6>
                                        <pre className="bg-light p-2">{codeFragments[index]}</pre>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProgressPage;
