//=============================================================================
// Viz_GameControlsExtender.js [MZ] (v1.0.2)
//=============================================================================

/*:
 * @target MZ
 * @plugindesc [MZ] (v1.0.2) Extiende la cantidad de inputs posibles del mando y teclado.
 * @author Vizcacha
 * @url https://github.com/Cri-ParraC/Viz_GameControlsExtender
 * @help Viz_GameControlsExtender.js [MZ] (v1.0.2)
 * ----------------------------------------------------------------------------
 * Plugin para RPG Maker MZ que extiende la cantidad de inputs posibles del
 * mando y teclado.
 * 
 * En mandos, añade el stick derecho, los triggers y botones faltantes. Estos
 * inputs pueden ser utilizados por otros plugins.
 * 
 * Permite también, de manera opcional, configurar el plugin para intercambiar
 * de lugar las funciones los botones A (ok) y B (cancel) del mando.
 * 
 * @param joystick
 * @text Mando
 * 
 * @param switchAB
 * @text ¿Intercambiar A y B?
 * @type boolean
 * @desc ¿Intercambiar de lugar las funciones de los botones A y B?
 *       Defecto: No (false)
 * @on Sí
 * @off No
 * @default false
 * @parent joystick
 */

(() => {
  "use strict";

  console.info("Viz_GameControlsExtender.js [MZ] (v1.0.2)");

  window.Imported ||= {};
  Imported.Viz_GameControlsExtender = 1.0;

  const parameters = PluginManager.parameters('Viz_GameControlsExtender');
  const switchAB = parameters.switchAB === 'true';

  const myInput = {};

  myInput.keyMapper = {
    9: "tab",       // tab
    13: "ok",       // enter
    16: "shift",    // shift
    17: "control",  // control
    18: "control",  // alt
    27: "escape",   // escape
    32: "ok",       // space
    33: "pageup",   // pageup
    34: "pagedown", // pagedown
    37: "left",     // left arrow
    38: "up",       // up arrow
    39: "right",    // right arrow
    40: "down",     // down arrow
    45: "escape",   // insert
    81: "pageup",   // Q
    87: "pagedown", // W
    88: "escape",   // X
    90: "ok",       // Z
    96: "escape",   // numpad 0
    98: "down",     // numpad 2
    100: "left",    // numpad 4
    102: "right",   // numpad 6
    104: "up",      // numpad 8
    120: "debug"    // F9
  };

  myInput.gamepadMapper = {
    0: "ok",       // A
    1: "cancel",   // B
    2: "shift",    // X
    3: "menu",     // Y
    4: "pageup",   // LB
    5: "pagedown", // RB
    6: "",         // LT
    7: "",         // RT
    8: "",         // View
    9: "",         // Menu
    10: "",        // LSB
    11: "",        // RSB
    12: "up",      // D-PAD ↑
    13: "down",    // D-PAD ↓
    14: "left",    // D-PAD ←
    15: "right",   // D-PAD →
    16: "",        // Guide
    // Análogos
    100: "up",     // LSY ↑
    101: "down",   // LSY ↓
    102: "left",   // LSY ←
    103: "right",  // LSY →
    200: "",       // RSY ↑
    201: "",       // RSY ↓
    202: "",       // RSX ←
    203: ""        // RSX →
  };

  if (switchAB) {
    myInput.gamepadMapper[0] = "cancel";
    myInput.gamepadMapper[1] = "ok";
  }

  //-----------------------------------------------------------------------------
  // Input
  //-----------------------------------------------------------------------------

  Input.keyMapper = myInput.keyMapper;
  Input.gamepadMapper = myInput.gamepadMapper;

  // Input._updateGamepadState

  Input._updateGamepadState = function (gamepad) {
    const lastState = this._gamepadStates[gamepad.index] || [];
    const newState = [];
    const buttons = gamepad.buttons;
    const axes = gamepad.axes;
    const threshold = 0.5;
    newState[100] = false;
    newState[101] = false;
    newState[102] = false;
    newState[103] = false;
    newState[200] = false;
    newState[201] = false;
    newState[202] = false;
    newState[203] = false;
    for (let i = 0; i < buttons.length; i++) {
      newState[i] = buttons[i].pressed;
    }
    if (axes[1] < -threshold) {
      newState[100] = true; // LSY ↑
    } else if (axes[1] > threshold) {
      newState[101] = true; // LSY ↓
    }
    if (axes[0] < -threshold) {
      newState[102] = true; // LSX ←
    } else if (axes[0] > threshold) {
      newState[103] = true; // LSX →
    }
    if (axes[3] < -threshold) {
      newState[200] = true; // RSY ↑
    } else if (axes[3] > threshold) {
      newState[201] = true; // RSY ↓
    }
    if (axes[2] < -threshold) {
      newState[202] = true; // RSX ←
    } else if (axes[2] > threshold) {
      newState[203] = true; // RSX →
    }
    for (let j = 0; j < newState.length; j++) {
      if (newState[j] !== lastState[j]) {
        const buttonName = this.gamepadMapper[j];
        if (buttonName) {
          this._currentState[buttonName] = newState[j];
        }
      }
    }
    this._gamepadStates[gamepad.index] = newState;
  };

})();