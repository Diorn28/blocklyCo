import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ExercisesState {
    progress: boolean[];
    codeFragments: string[];
}

const initialState: ExercisesState = {
    progress: [false, false, false, false], // Avancement des exercices (faux par défaut)
    codeFragments: [
        ' constructor() {\n' +
        '    loadView("main", "login", function () {\n' +
        '      document\n' +
        '        .getElementById("btnConnect")\n' +
        '        .addEventListener("click", loginCtrl.btnConnect);\n' +
        '      setInputsFromCookies();\n' +
        '    });\n' +
        '  }',
        'btnConnect() {\n' +
        '    let host = document.getElementById("inputHost").value;\n' +
        '    let port = document.getElementById("inputPort").value;\n' +
        '    let name = document.getElementById("inputName").value;\n' +
        '\n' +
        '    if (\n' +
        '      host === undefined ||\n' +
        '      host === "" ||\n' +
        '      port === undefined ||\n' +
        '      port === "" ||\n' +
        '      name === undefined ||\n' +
        '      name === ""\n' +
        '    ) {\n' +
        '      alert("Please fill out all fields");\n' +
        '      return;\n' +
        '    }',
        'port = parseInt(port);\n' +
        '    if (isNaN(port) || port < 1) {\n' +
        '      alert("Invalid port number");\n' +
        '      return;\n' +
        '    }',
        '  setCookie("host", host, 365);\n' +
        '    setCookie("port", port, 365);\n' +
        '\n' +
        '    try {\n' +
        '      socket.close();\n' +
        '    } catch (error) {}\n' +
        '\n' +
        '    chatCtrl = new ChatCtrl(host, port, name);\n' +
        '  }'
    ], // Bouts de code débloqués par exercice
};

export const exercisesSlice = createSlice({
    name: 'exercises',
    initialState,
    reducers: {
        markExerciseAsComplete: (
            state,
            action: PayloadAction<{ exerciseIndex: number }>
        ) => {
            state.progress[action.payload.exerciseIndex] = true;
        },
    },
});

export const { markExerciseAsComplete } = exercisesSlice.actions;
export default exercisesSlice.reducer;
