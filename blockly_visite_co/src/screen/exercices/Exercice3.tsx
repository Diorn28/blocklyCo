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

const Exercice3 = () => {
    const blocklyDiv = useRef<HTMLDivElement | null>(null);
    const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
    const [consoleOutput, setConsoleOutput] = useState<string>('');  // État pour la console
    const progress = useSelector((state: RootState) => state.exercises.progress[2]); // Progression de l'exercice 3
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
                        { "kind": "CATEGORY", "name": "Math", "colour": "#5CA65C", "contents": [{ "kind": "block", "type": "math_number" }] },
                        { "kind": "CATEGORY", "name": "Texte", "colour": "#5CA68D", "contents": [{ "kind": "block", "type": "text" }, { "kind": "block", "type": "text_print" }] },
                        { "kind": "CATEGORY", "name": "Variables", "custom": "VARIABLE", "colour": "#A65C81" },
                        { "kind": "CATEGORY", "name": "Logique", "colour": "#5CA6A5", "contents": [
                            { "kind": "block", "type": "controls_if" },  // Blocs "if"
                            { "kind": "block", "type": "logic_compare" },  // Comparaison (>, <, =)
                            { "kind": "block", "type": "logic_boolean" }  // Booléens (vrai/faux)
                        ]}
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
                console.log(code)
            } catch (e) {
                setConsoleOutput(prevOutput => prevOutput + `Erreur dans votre code: ${e}\n`);
            }

            window.alert = originalAlert;
        }
    };

    const checkExerciseSuccess = (code: string) => {
        // Vérifier la déclaration de deux variables sur une seule ligne
        const varDeclarations = code.match(/var\s+[a-zA-Z_]\w*(?:\s*,\s*[a-zA-Z_]\w*){1}\s*;/);

        // Vérifier les affectations de valeurs (nombres uniquement)
        const numberAssignments = code.match(/[a-zA-Z_]\w*\s*=\s*\d+\s*;/g);

        // Vérifier la présence d'une structure if-else if-else
        const ifStatement = code.match(/if\s*\((.*?)\)\s*{/);
        const elseIfStatement = code.match(/else\s*if\s*\((.*?)\)\s*{/);
        const elseStatement = code.match(/else\s*{/);

        // Vérifier que les conditions comparent les deux variables
        const ifCondition = ifStatement ? ifStatement[1] : null;  // Condition dans le if
        const elseIfCondition = elseIfStatement ? elseIfStatement[1] : null;  // Condition dans le else if

        // Regex pour vérifier une comparaison entre deux variables
        const comparisonRegex = /([a-zA-Z_]\w*)\s*(>|<|>=|<=|==)\s*([a-zA-Z_]\w*)/;

        const validIfCondition = ifCondition && comparisonRegex.test(ifCondition);
        const validElseIfCondition = elseIfCondition && comparisonRegex.test(elseIfCondition);

        let errorMessage = '';

        // Étape 1 : Vérification des déclarations de variables
        if (!varDeclarations) {
            errorMessage += "Erreur : Vous devez déclarer deux variables sur une seule ligne.\n";
        }

        // Étape 2 : Vérifier les affectations de valeurs numériques
        if (!numberAssignments || numberAssignments.length < 2) {
            errorMessage += "Erreur : Vous devez initialiser deux variables avec des nombres.\n";
        }

        // Étape 3 : Vérifier l'utilisation d'un bloc 'if' avec une condition valide
        if (!ifStatement || !validIfCondition) {
            errorMessage += "Erreur : Vous devez utiliser un bloc 'if' avec une condition valide comparant les deux variables.\n";
        }

        // Étape 4 : Vérifier l'utilisation d'un bloc 'else if' avec une condition valide
        if (!elseIfStatement || !validElseIfCondition) {
            errorMessage += "Erreur : Vous devez utiliser un bloc 'else if' avec une condition valide comparant les deux variables.\n";
        }

        // Étape 5 : Vérifier la présence d'un bloc 'else'
        if (!elseStatement) {
            errorMessage += "Erreur : Vous devez inclure un bloc 'else'.\n";
        }

        // Si tout est correct, marquer l'exercice comme réussi
        if (!errorMessage) {
            setExerciseStatus('Exercice réussi ! Vous pouvez retrouver votre bout de code dans la section "Avancement".');
            dispatch(markExerciseAsComplete({ exerciseIndex: 2}));
        } else {
            setExerciseStatus(errorMessage);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4 text-center">Exercice 3: Conditions (if, else if, else)</h2>
            <p className="instruction">
                Consigne : Créez deux variables contenant des nombres de votre choix.
                Ensuite, utilisez un bloc conditionnel pour vérifier si la première variable est plus grande, plus petite ou égale à la seconde.
                Utilisez obligatoirement les blocs if, else if, et else. Astuce : Cliquez sur l'option réglage du bloc conditionnel pour ajouter des else if et else.
                Printez une phrase différentes dans chaques cas.
            </p>
            <div ref={blocklyDiv} className={`border ${progress ? 'workspace-locked' : ''}`} style={{ height: '70vh', width: '100%' }}></div>

            <div className="d-flex justify-content-between mt-4">
                <button className="btn btn-primary" onClick={runCode}>Exécuter le Code</button>
                {progress && (
                    <button className="btn btn-success" onClick={() => navigate('/exercice4')}>Aller à l'exercice suivant</button>
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

export default Exercice3;
