import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {markExerciseAsComplete} from '../../redux/ExerciceSlice';
import {RootState} from '../../redux/Store';
import {useNavigate} from 'react-router-dom';
import * as Blockly from 'blockly';
import {javascriptGenerator} from 'blockly/javascript';
import 'blockly/blocks';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../style/Exercice1.css';

const Exercice4 = () => {
    const blocklyDiv = useRef<HTMLDivElement | null>(null);
    const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
    const [consoleOutput, setConsoleOutput] = useState<string>('');  // État pour la console
    const progress = useSelector((state: RootState) => state.exercises.progress[3]); // Progression de l'exercice 4
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [exerciseStatus, setExerciseStatus] = useState<string>(progress ? 'Exercice réussi ! Vous pouvez retrouver votre bout de code dans la section "Avancement".' : 'Non terminé');

    useEffect(() => {
        if (workspaceRef.current) {
            workspaceRef.current.dispose();
        }

        if (blocklyDiv.current) {
            workspaceRef.current = Blockly.inject(blocklyDiv.current, {
                toolbox: {
                    "kind": "categoryToolbox",
                    "contents": [
                        {
                            "kind": "CATEGORY",
                            "name": "Math",
                            "colour": "#5CA65C",
                            "contents": [{"kind": "block", "type": "math_number"}]
                        },
                        {
                            "kind": "CATEGORY",
                            "name": "Texte",
                            "colour": "#5CA68D",
                            "contents": [{"kind": "block", "type": "text"}, {
                                "kind": "block",
                                "type": "text_print"
                            }, {"kind": "block", "type": "text_join"}]
                        },
                        {"kind": "CATEGORY", "name": "Variables", "custom": "VARIABLE", "colour": "#A65C81"},
                        {
                            "kind": "CATEGORY", "name": "Boucles", "colour": "#5C81A6", "contents": [
                                {"kind": "block", "type": "controls_for"}  // Boucle for uniquement
                            ]
                        }
                    ]
                },
                grid: {
                    spacing: 20,
                    length: 3,
                    colour: '#ccc',
                    snap: true,
                },
                trashcan: true,
            });

        }

        (window as any).customLog = (message: string) => {
            setConsoleOutput(prevOutput => prevOutput + message + '\n');
        };
    }, [progress]);

    const runCode = () => {
        if (workspaceRef.current) {
            setConsoleOutput('');
            setExerciseStatus('');

            const originalAlert = window.alert;
            window.alert = (message: string) => {
                setConsoleOutput(prevOutput => prevOutput + message + '\n');
            };

            const code = javascriptGenerator.workspaceToCode(workspaceRef.current);
            try {
                eval(code);
                checkExerciseSuccess(code);
                console.log(code);
            } catch (e) {
                setConsoleOutput(prevOutput => prevOutput + `Erreur dans votre code: ${e}\n`);
            }

            window.alert = originalAlert;
        }
    };

    const checkExerciseSuccess = (code: string) => {
        // Vérification de la déclaration de toutes les variables sur une seule ligne
        const varDeclarations = code.match(/var\s+[a-zA-Z_]\w*(?:\s*,\s*[a-zA-Z_]\w*)*\s*;/);

        // Vérification de la présence d'une boucle for avec une condition
        const forLoop = code.match(/for\s*\(\s*[a-zA-Z_]\w*\s*=\s*\d+;\s*[a-zA-Z_]\w*\s*(<=|>=)\s*\d+;\s*[a-zA-Z_]\w*\s*(\+\+|--)\s*\)\s*{.*?}/s);

        // Vérification de la présence d'un window.alert affichant le compteur (i)
        const alertStatements = code.match(/window\.alert\(\s*['"]Tour numéro : ['"]\s*\+\s*(?:String\()?([a-zA-Z_]\w*)\)?\s*\)/);

        // Initialisation de l'erreur
        let errorMessage = '';

        // Vérification de la déclaration des variables sur une seule ligne
        if (!varDeclarations) {
            errorMessage += "Erreur : Vous devez déclarer toutes les variables sur une seule ligne.\n";
        }

        // Vérification de la boucle for correcte
        if (!forLoop) {
            errorMessage += "Erreur : Vous devez créer une boucle for qui répète l'action tant que la condition est vérifiée.\n";
        }

        // Vérification de l'affichage correct avec 'Tour numéro : ' et le compteur
        if (!alertStatements) {
            errorMessage += "Erreur : Vous devez afficher 'Tour numéro : ' suivi de la valeur du compteur à chaque itération.\n";
        }

        // Si toutes les vérifications sont réussies
        if (!errorMessage && varDeclarations && forLoop && alertStatements) {
            setExerciseStatus('Exercice réussi ! Vous pouvez retrouver votre bout de code dans la section "Avancement".');
            dispatch(markExerciseAsComplete({ exerciseIndex: 3}));
        } else {
            setExerciseStatus(errorMessage || 'Exercice échoué : Assurez-vous de respecter toutes les consignes.');
        }
    };




    return (
        <div className="container mt-5">
            <h2 className="mb-4 text-center">Exercice 4: Utiliser une boucle for pour répéter une action</h2>
            <p className="instruction">
                Créez une boucle for qui initialise un compteur (i = 1), répète la boucle tant que i &lt;= 5 et affiche "Tour numéro : " suivi de la valeur de i à chaque itération.
                Ne créez pas de variable en dehors de la boucle.
            </p>
            <div ref={blocklyDiv} className={`border ${progress ? 'workspace-locked' : ''}`}
                 style={{height: '70vh', width: '100%'}}></div>

            <div className="d-flex justify-content-between mt-4">
                <button className="btn btn-primary" onClick={runCode} >Exécuter le Code</button>
                {progress && (
                    <button className="btn btn-success" onClick={() => navigate('/progress')}>Vous avez finis tout les exercices!</button>
                )}
            </div>

            <div className="console mt-4">
                <h3>Console</h3>
                <pre className="bg-light p-3 border">{consoleOutput}</pre>
            </div>

            <div className="exercise-status mt-4">
                <h3>Status de l'exercice</h3>
                <p className={`text-${exerciseStatus === 'Exercice réussi ! Vous pouvez retrouver votre bout de code dans la section "Avancement".' ? 'success' : 'danger'}`}>{exerciseStatus}</p>
            </div>
        </div>
    );
};

export default Exercice4;
