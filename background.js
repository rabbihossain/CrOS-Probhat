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
"Digit1": { "plain": {"plain": "১", "shifted": "!"}, "alternate": {"plain": "", "shifted":""}, "code": "BracketLeft"},
"Digit2": { "plain": {"plain": "২", "shifted": "@"}, "alternate": {"plain": "", "shifted":""}, "code": "BracketRight"},
"Digit3": { "plain": {"plain": "৩", "shifted": "#"}, "alternate": {"plain": "", "shifted":""}, "code": "Slash"},
"Digit4": { "plain": {"plain": "৪", "shifted": "৳"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyP"},
"Digit5": { "plain": {"plain": "৫", "shifted": "%"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyF"},
"Digit6": { "plain": {"plain": "৬", "shifted": zwnj}, "alternate": {"plain": "", "shifted":""}, "code": "KeyM"},
"Digit7": { "plain": {"plain": "৭", "shifted": "ঞ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyL"},
"Digit8": { "plain": {"plain": "৮", "shifted": "ৎ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyJ"},
"Digit9": { "plain": {"plain": "৯", "shifted": "("}, "alternate": {"plain": "", "shifted":""}, "code": "Digit4"},
"Digit0": { "plain": {"plain": "০", "shifted": ")"}, "alternate": {"plain": "", "shifted":""}, "code": "Digit3"},
"Minus": { "plain": {"plain": "-", "shifted": "_"}, "alternate": {"plain": "", "shifted":""}, "code": "Digit2"},
"Equal": { "plain": {"plain": "=", "shifted": "+"}, "alternate": {"plain": "", "shifted":""}, "code": "Digit1"},
"KeyQ": { "plain": {"plain": "দ", "shifted": "ধ"}, "alternate": {"plain": "", "shifted":""}, "code": "Semicolon"},
"KeyW": { "plain": {"plain": "ূ", "shifted": "ঊ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyQ"},
"KeyE": { "plain": {"plain": "ী", "shifted": "ঈ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyB"},
"KeyR": { "plain": {"plain": "র", "shifted": "ড়"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyY"},
"KeyT": { "plain": {"plain": "ট", "shifted": "ঠ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyU"},
"KeyY": { "plain": {"plain": "এ", "shifted": "ঐ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyR"},
"KeyU": { "plain": {"plain": "ু", "shifted": "উ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyS"},
"KeyI": { "plain": {"plain": "ি", "shifted": "ই"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyO"},
"KeyO": { "plain": {"plain": "ও", "shifted": "ঔ"}, "alternate": {"plain": "", "shifted":""}, "code": "Period"},
"KeyP": { "plain": {"plain": "প", "shifted": "ফ"}, "alternate": {"plain": "", "shifted":""}, "code": "Digit6"},
"BracketLeft": { "plain": {"plain": "ে", "shifted": "ৈ"}, "alternate": {"plain": "", "shifted":""}, "code": "Digit5"},
"BracketRight": { "plain": {"plain": "ো", "shifted": "ৌ"}, "alternate": {"plain": "", "shifted":""}, "code": "Equal"},
"KeyA": { "plain": {"plain": "া", "shifted": "অ"}, "alternate": {"plain": "", "shifted":""}, "code": "Minus"},
"KeyS": { "plain": {"plain": "স", "shifted": "ষ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyK"},
"KeyD": { "plain": {"plain": "ড", "shifted": "ঢ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyC"},
"KeyF": { "plain": {"plain": "ত", "shifted": "থ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyD"},
"KeyG": { "plain": {"plain": "গ", "shifted": "ঘ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyT"},
"KeyH": { "plain": {"plain": "হ", "shifted": "ঃ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyH"},
"KeyJ": { "plain": {"plain": "জ", "shifted": "ঝ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyE"},
"KeyK": { "plain": {"plain": "ক", "shifted": "খ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyA"},
"KeyL": { "plain": {"plain": "ল", "shifted": "ং"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyZ"},
"Semicolon": { "plain": {"plain": ";", "shifted": ":"}, "alternate": {"plain": "", "shifted":""}, "code": "Digit8"},
"Quote": { "plain": {"plain": "'", "shifted": "\""}, "alternate": {"plain": "", "shifted":""}, "code": "Digit7"},
"KeyZ": { "plain": {"plain": "য়", "shifted": "য"}, "alternate": {"plain": "", "shifted":""}, "code": "Quote"},
"KeyX": { "plain": {"plain": "শ", "shifted": "ঢ়"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyX"},
"KeyC": { "plain": {"plain": "চ", "shifted": "ছ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyG"},
"KeyV": { "plain": {"plain": "আ", "shifted": "ঋ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyV"},
"KeyB": { "plain": {"plain": "ব", "shifted": "ভ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyW"},
"KeyN": { "plain": {"plain": "ন", "shifted": "ণ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyN"},
"KeyM": { "plain": {"plain": "ম", "shifted": "ঙ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyL"},
"Comma": { "plain": {"plain": ",", "shifted": "ৃ"}, "alternate": {"plain": "", "shifted":""}, "code": "Comma"},
"Period": { "plain": {"plain": "।", "shifted": "ঁ"}, "alternate": {"plain": "", "shifted":""}, "code": "Digit0"},
"Slash": { "plain": {"plain": "্", "shifted": "?"}, "alternate": {"plain": "", "shifted":""}, "code": "Digit9"},
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
