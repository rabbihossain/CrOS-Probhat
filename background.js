/*
Copyright 2014 Google Inc. All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
var AltGr = { PLAIN: "plain", ALTERNATE: "alternate" };
var Shift = { PLAIN: "plain", SHIFTED: "shifted" };

var contextID = -1;
var altGrState = AltGr.PLAIN;
var shiftState = Shift.PLAIN;
var lastRemappedKeyEvent = undefined;

var zwnjEl = document.createElement('textarea');
zwnjEl.innerHTML = "&zwnj;";
zwnj = zwnjEl.value;

var lut = {
"Backquote": { "plain": {"plain": zwnj, "shifted": ""}, "alternate": {"plain": "", "shifted":""}, "code": "Backquote"},
"Digit1": { "plain": {"plain": "১", "shifted": "!"}, "alternate": {"plain": "", "shifted":""}, "code": "Digit1"},
"Digit2": { "plain": {"plain": "২", "shifted": "@"}, "alternate": {"plain": "", "shifted":""}, "code": "Digit2"},
"Digit3": { "plain": {"plain": "৩", "shifted": "#"}, "alternate": {"plain": "", "shifted":""}, "code": "Digit3"},
"Digit4": { "plain": {"plain": "৪", "shifted": "৳"}, "alternate": {"plain": "", "shifted":""}, "code": "Digit4"},
"Digit5": { "plain": {"plain": "৫", "shifted": "%"}, "alternate": {"plain": "", "shifted":""}, "code": "Digit5"},
"Digit6": { "plain": {"plain": "৬", "shifted": "^"}, "alternate": {"plain": "", "shifted":""}, "code": "Digit6"},
"Digit7": { "plain": {"plain": "৭", "shifted": "ঞ"}, "alternate": {"plain": "", "shifted":""}, "code": "Digit7"},
"Digit8": { "plain": {"plain": "৮", "shifted": "ৎ"}, "alternate": {"plain": "", "shifted":""}, "code": "Digit8"},
"Digit9": { "plain": {"plain": "৯", "shifted": "("}, "alternate": {"plain": "", "shifted":""}, "code": "Digit9"},
"Digit0": { "plain": {"plain": "০", "shifted": ")"}, "alternate": {"plain": "", "shifted":""}, "code": "Digit0"},
"Minus": { "plain": {"plain": "-", "shifted": "_"}, "alternate": {"plain": "", "shifted":""}, "code": "Minus"},
"Equal": { "plain": {"plain": "=", "shifted": "+"}, "alternate": {"plain": "", "shifted":""}, "code": "Equal"},
"KeyQ": { "plain": {"plain": "দ", "shifted": "ধ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyQ"},
"KeyW": { "plain": {"plain": "ূ", "shifted": "ঊ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyW"},
"KeyE": { "plain": {"plain": "ী", "shifted": "ঈ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyE"},
"KeyR": { "plain": {"plain": "র", "shifted": "ড়"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyR"},
"KeyT": { "plain": {"plain": "ট", "shifted": "ঠ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyT"},
"KeyY": { "plain": {"plain": "এ", "shifted": "ঐ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyY"},
"KeyU": { "plain": {"plain": "ু", "shifted": "উ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyU"},
"KeyI": { "plain": {"plain": "ি", "shifted": "ই"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyI"},
"KeyO": { "plain": {"plain": "ও", "shifted": "ঔ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyO"},
"KeyP": { "plain": {"plain": "প", "shifted": "ফ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyP"},
"BracketLeft": { "plain": {"plain": "ে", "shifted": "ৈ"}, "alternate": {"plain": "", "shifted":""}, "code": "BracketLeft"},
"BracketRight": { "plain": {"plain": "ো", "shifted": "ৌ"}, "alternate": {"plain": "", "shifted":""}, "code": "BracketRight"},
"KeyA": { "plain": {"plain": "া", "shifted": "অ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyA"},
"KeyS": { "plain": {"plain": "স", "shifted": "ষ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyS"},
"KeyD": { "plain": {"plain": "ড", "shifted": "ঢ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyD"},
"KeyF": { "plain": {"plain": "ত", "shifted": "থ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyF"},
"KeyG": { "plain": {"plain": "গ", "shifted": "ঘ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyG"},
"KeyH": { "plain": {"plain": "হ", "shifted": "ঃ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyH"},
"KeyJ": { "plain": {"plain": "জ", "shifted": "ঝ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyJ"},
"KeyK": { "plain": {"plain": "ক", "shifted": "খ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyK"},
"KeyL": { "plain": {"plain": "ল", "shifted": "ং"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyL"},
"Semicolon": { "plain": {"plain": ";", "shifted": ":"}, "alternate": {"plain": "", "shifted":""}, "code": "Semicolon"},
"Quote": { "plain": {"plain": "'", "shifted": "\""}, "alternate": {"plain": "", "shifted":""}, "code": "Quote"},
"KeyZ": { "plain": {"plain": "য়", "shifted": "য"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyZ"},
"KeyX": { "plain": {"plain": "শ", "shifted": "ঢ়"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyX"},
"KeyC": { "plain": {"plain": "চ", "shifted": "ছ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyC"},
"KeyV": { "plain": {"plain": "আ", "shifted": "ঋ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyV"},
"KeyB": { "plain": {"plain": "ব", "shifted": "ভ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyB"},
"KeyN": { "plain": {"plain": "ন", "shifted": "ণ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyN"},
"KeyM": { "plain": {"plain": "ম", "shifted": "ঙ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyM"},
"Comma": { "plain": {"plain": ",", "shifted": "ৃ"}, "alternate": {"plain": "", "shifted":""}, "code": "Comma"},
"Period": { "plain": {"plain": "।", "shifted": "ঁ"}, "alternate": {"plain": "", "shifted":""}, "code": "Period"},
"Slash": { "plain": {"plain": "্", "shifted": "?"}, "alternate": {"plain": "", "shifted":""}, "code": "Slash"},
};
    

chrome.input.ime.onFocus.addListener(function(context) {
  contextID = context.contextID;
});

function updateAltGrState(keyData) {
  altGrState = (keyData.code == "AltRight") ? ((keyData.type == "keydown") ? AltGr.ALTERNATE : AltGr.PLAIN)
                                              : altGrState;
}

function updateShiftState(keyData) {
  shiftState = ((keyData.shiftKey && !(keyData.capsLock)) || (!(keyData.shiftKey) && keyData.capsLock)) ? 
                 Shift.SHIFTED : Shift.PLAIN;
}

function isPureModifier(keyData) {
  return (keyData.key == "Shift") || (keyData.key == "Ctrl") || (keyData.key == "Alt");
}

function isRemappedEvent(keyData) {
  // hack, should check for a sender ID (to be added to KeyData)
  return lastRemappedKeyEvent != undefined &&
         (lastRemappedKeyEvent.key == keyData.key &&
          lastRemappedKeyEvent.code == keyData.code &&
          lastRemappedKeyEvent.type == keyData.type
         ); // requestID would be different so we are not checking for it  
}


chrome.input.ime.onKeyEvent.addListener(
    function(engineID, keyData) {
      var handled = false;
      
      if (isRemappedEvent(keyData)) {
        lastRemappedKeyEvent = undefined;
        return handled;
      }

      updateAltGrState(keyData);
      updateShiftState(keyData);
                
      if (lut[keyData.code]) {
          var remappedKeyData = keyData;
          remappedKeyData.key = lut[keyData.code][altGrState][shiftState];
          remappedKeyData.code = lut[keyData.code].code;
        
        if (chrome.input.ime.sendKeyEvents != undefined) {
          chrome.input.ime.sendKeyEvents({"contextID": contextID, "keyData": [remappedKeyData]});
          handled = true;
          lastRemappedKeyEvent = remappedKeyData;
        } else if (keyData.type == "keydown" && !isPureModifier(keyData)) {
          chrome.input.ime.commitText({"contextID": contextID, "text": remappedKeyData.key});
          handled = true;
        }
      }
      
      return handled;
});
