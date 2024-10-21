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

const Exercice2 = () => {
    const blocklyDiv = useRef<HTMLDivElement | null>(null);
    const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
    const [consoleOutput, setConsoleOutput] = useState<string>('');  // État pour la console
    const progress = useSelector((state: RootState) => state.exercises.progress[1]); // Progression de l'exercice 2
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
                        { "kind": "CATEGORY", "name": "Texte", "colour": "#5CA68D", "contents": [{ "kind": "block", "type": "text" }, { "kind": "block", "type": "text_print" }, { "kind": "block", "type": "text_join" }] },
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
                console.log(code);
                checkExerciseSuccess(code);
            } catch (e) {
                setConsoleOutput(prevOutput => prevOutput + `Erreur dans votre code: ${e}\n`);
            }

            window.alert = originalAlert;
        }
    };

    const checkExerciseSuccess = (code: string) => {
        // Vérification de la déclaration de quatre variables sur une seule ligne
        const varDeclarations = code.match(/var\s+[a-zA-Z_]\w*(?:\s*,\s*[a-zA-Z_]\w*){3}\s*;/);

        // Vérification de deux affectations numériques et d'une chaîne de caractères
        const numberAssignments = code.match(/[a-zA-Z_]\w*\s*=\s*\d+\s*;/g);
        const stringAssignment = code.match(/[a-zA-Z_]\w*\s*=\s*['"].*['"]\s*;/);

        // Vérification de l'addition entre deux variables numériques
        const additionAssignment = code.match(/[a-zA-Z_]\w*\s*=\s*[a-zA-Z_]\w*\s*\+\s*[a-zA-Z_]\w*\s*;/);

        // Vérification de la concaténation et de l'affichage via console.log ou window.alert
        // On cherche n'importe quelle forme de concaténation et d'affichage
        const concatAndDisplay = code.match(/(window\.alert|console\.log)\(.*\+/);

        let errorMessage = '';

        // Étape 1 : Vérifier la déclaration des variables
        if (!varDeclarations) {
            errorMessage += "Erreur : Vous devez déclarer les quatre variables.\n";
        }

        // Étape 2 : Vérifier qu'au moins deux variables ont des affectations numériques
        if (!numberAssignments || numberAssignments.length < 2) {
            errorMessage += "Erreur : Vous devez initialiser deux variables avec des nombres.\n";
        }

        // Étape 3 : Vérifier l'affectation d'une chaîne de caractères
        if (!stringAssignment) {
            errorMessage += "Erreur : Vous devez initialiser une variable avec une chaîne de caractères.\n";
        }

        // Étape 4 : Vérifier l'addition des deux variables contenant des nombres
        if (!additionAssignment) {
            errorMessage += "Erreur : Vous devez additionner deux variables contenant des nombres et stocker le résultat dans une nouvelle variable.\n";
        }

        // Étape 5 : Vérifier la concaténation et l'affichage
        if (!concatAndDisplay) {
            errorMessage += "Erreur : Vous devez concaténer le résultat de l'addition avec une chaîne et l'afficher avec print'.\n";
        }

        // Si tout est correct, on marque l'exercice comme réussi
        if (!errorMessage || progress) {
            setExerciseStatus('Exercice réussi ! Vous pouvez retrouver votre bout de code dans la section "Avancement".');
            dispatch(markExerciseAsComplete({ exerciseIndex: 1}));
        } else {
            setExerciseStatus(errorMessage);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4 text-center">Exercice 2: Opérations arithmétiques et concaténation</h2>
            <p className="instruction">
                Créez deux variables contenant chacune un nombre de votre choix. Ensuite, créez une troisième variable qui contiendra l'addition de ces deux nombres.
                Créez ensuite une quatrième variable contenant une chaîne de caractères de votre choix.
                Enfin, affichez la concaténation de cette chaîne de caractères avec le résultat de l'addition dans la console.            </p>
            <div ref={blocklyDiv} className={`border ${progress ? 'workspace-locked' : ''}`} style={{ height: '70vh', width: '100%' }}></div>

            <div className="d-flex justify-content-between mt-4">
                <button className="btn btn-primary" onClick={runCode} >Exécuter le Code</button>
                {progress && (
                    <button className="btn btn-success" onClick={() => navigate('/exercice3')}>Aller à l'exercice suivant</button>
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

export default Exercice2;
