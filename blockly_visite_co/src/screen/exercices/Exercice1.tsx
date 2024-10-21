import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { markExerciseAsComplete } from '../../redux/ExerciceSlice';
import { RootState } from '../../redux/Store';
import { useNavigate } from 'react-router-dom';
import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';
import 'blockly/blocks';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../style/Exercice1.css';

const Exercice1 = () => {
    const blocklyDiv = useRef<HTMLDivElement | null>(null);
    const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
    const [consoleOutput, setConsoleOutput] = useState<string>('');  // État pour la console
    const progress = useSelector((state: RootState) => state.exercises.progress[0]); // Progression de l'exercice 1
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
                        { "kind": "CATEGORY", "name": "Math", "colour": "#5CA65C", "contents": [{ "kind": "block", "type": "math_number" }, { "kind": "block", "type": "math_arithmetic" }] },
                        { "kind": "CATEGORY", "name": "Texte", "colour": "#5CA68D", "contents": [{ "kind": "block", "type": "text" }, { "kind": "block", "type": "text_print" }] },
                        { "kind": "CATEGORY", "name": "Variables", "custom": "VARIABLE", "colour": "#A65C81" }
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
        // Vérifier que les variables 'number' et 'string' sont déclarées, même sur une seule ligne
        const varDeclaration = code.match(/var\s+(number|string)\s*,\s*(number|string)\s*;/);

        // Vérifier les assignations des variables
        const numberAssignment = code.match(/number\s*=\s*\d+\s*;/);
        const stringAssignment = code.match(/string\s*=\s*['"].*['"]\s*;/);

        // Vérifier qu'elles sont affichées via print (console.log ou window.alert)
        const printNumber = code.match(/console\.log\(\s*number\s*\)/) || code.match(/window\.alert\(\s*number\s*\)/);
        const printString = code.match(/console\.log\(\s*string\s*\)/) || code.match(/window\.alert\(\s*string\s*\)/);

        // Valider les conditions : déclaration, assignation et affichage
        if (varDeclaration && numberAssignment && stringAssignment && printNumber && printString) {
            setExerciseStatus('Exercice réussi ! Vous pouvez retrouver votre bout de code dans la section "Avancement".');
            dispatch(markExerciseAsComplete({ exerciseIndex: 0}));
        } else {
            setExerciseStatus("Exercice échoué : Assurez-vous de déclarer deux variables ('number' et 'string'), d'assigner un nombre et une chaîne de caractères, et de les afficher.");
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4 text-center">Exercice 1: Utiliser une variable pour afficher un nombre</h2>
            <p className="instruction">
                Consigne : Créez une variable avec comme nom "number" qui contiendra un nombre de votre choix. Créez ensuite une variable avec comme nom "string"
                qui contiendra une chaîne de caractères de votre choix. Affichez les deux variables dans la console en utilisant les blocs print.
            </p>
            <div ref={blocklyDiv} className={`border ${progress ? 'workspace-locked' : ''}`} style={{ height: '70vh', width: '100%' }}></div>

            <div className="d-flex justify-content-between mt-4">
                <button className="btn btn-primary" onClick={runCode} >Exécuter le Code</button>
                {progress && (
                    <button className="btn btn-success" onClick={() => navigate('/exercice2')}>Aller à l'exercice suivant</button>
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

export default Exercice1;
