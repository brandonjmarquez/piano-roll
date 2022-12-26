"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const howler_1 = require("howler");
require("./Piano.css");
const qwertyNote = require('./note-to-qwerty-key');
function KeyNoteInput(props) {
    const ref = (0, react_1.useRef)(null);
    const [controller, setController] = (0, react_1.useState)({});
    // useEffect(() => {
    //   console.log(props.octave)
    // }, [props.octave])
    (0, react_1.useEffect)(() => {
        const onKeyDown = (e) => {
            if (e.repeat) {
                return;
            }
            let octave = props.octave;
            if (parseInt(e.code))
                octave = parseInt(e.code);
            console.warn('KEY DOWN');
            console.log(e);
            let key = e.key.toLowerCase(); // toLowerCase() is for caps lock
            setController((controller) => ({ ...controller, [key]: { octave: octave, pressed: true, pianoRoll: false } }));
        };
        const onKeyUp = (e) => {
            console.warn('KEY UP');
            let key = e.key.toLowerCase();
            setController((controller) => ({ ...controller, [key]: { octave: props.octave, pressed: false, pianoRoll: false } }));
        };
        // console.log('pianoRollKey', props.pianoRollKey)
        // if(typeof props.pianoRollKey[0] === 'string') {
        //   setController((controller) => ({...controller, [props.pianoRollKey[0]]: {octave: props.pianoRollKey[1], pressed: props.pianoRollKey[2], pianoRoll: true}}));
        // }
        const element = ref.current;
        element.addEventListener('keydown', onKeyDown);
        element.addEventListener('keyup', onKeyUp);
        return () => {
            element.removeEventListener('keydown', onKeyDown);
            element.removeEventListener('keyup', onKeyUp);
        };
    }, [props.octave]);
    (0, react_1.useEffect)(() => {
        // console.log(props.pianoRollKey)
        if (props.pianoRollKey[2]) {
            console.warn('POINTER DOWN');
        }
        else if (props.pianoRollKey[2] === false) {
            console.warn('POINTER UP');
        }
        if (props.pianoRollKey.length > 0) {
            setController((controller) => ({ ...controller, [props.pianoRollKey[0]]: { octave: props.pianoRollKey[1], pressed: props.pianoRollKey[2], pianoRoll: true } }));
        }
    }, [props.pianoRollKey]);
    (0, react_1.useEffect)(() => {
        const element = ref.current;
        element.focus();
        element.addEventListener('focusout', () => { element.focus(); });
        return () => {
            element.removeEventListener('focusout', () => { element.focus(); });
        };
    }, []);
    // const [time, setTime] = useState(Date.now());
    //THIS CAN POSSIBLY BE SIMPLIFIED!!!
    (0, react_1.useEffect)(() => {
        // console.log(controller)
        props.onNotePlayed(controller);
        // eslint-disable-next-line
    }, [controller]);
    return ((0, jsx_runtime_1.jsx)("input", { type: 'text', ref: ref, id: 'key-note-input' }));
}
function Piano(props) {
    // const [fetchedOctaves, setFetchedOctaves] = useState([]);
    const [fetchedOctaves, setFetchedOctaves] = (0, react_1.useState)({});
    const [keysPressed, setKeysPressed] = (0, react_1.useState)({});
    const [octavesInView, setOctavesInView] = (0, react_1.useState)([]);
    const [prevNotes, setPrevNotes] = (0, react_1.useState)({});
    const [octaveMinMax, setOctaveMinMax] = (0, react_1.useState)([0, 0]);
    // useEffect(() => {
    //   console.log(props.octave)
    // }, [props.octave])
    (0, react_1.useEffect)(() => {
        // console.log('|||||||||||||||||||||||||||||||||||||')
        // console.warn(notesPlayed)
        if (Object.keys(fetchedOctaves).length > 0) {
            let sound = fetchedOctaves[props.octave][props.volume];
            // sound.play('C')
            // sound.play('E')
            // sound.play('G')
            // sound.play('B')
        }
        // setTimeout(() => {
        //   setPianoRollKey(['a', 3, false])
        // }, 500)
    }, [fetchedOctaves]);
    (0, react_1.useEffect)(() => {
        function fetchSounds() {
            // let octave0 = new Howl({src:['']});
            // let octave1 = new Howl({src:['']});
            let octaveExists0 = true;
            let octaveExists1 = true;
            // console.log(octaveMinMax)
            // let octaveMin = octaveBounds()[0];
            // let octaveMax = octaveBounds()[1];
            let url0 = 'http://localhost:3001/sounds/' + props.sound + '/' + props.octave + '/' + props.volume;
            let url1 = 'http://localhost:3001/sounds/' + props.sound + '/' + (props.octave + 1) + '/' + props.volume;
            if (props.octave < octaveMinMax[0]) {
                octaveExists0 = false;
                // octave0 = new Howl({src: ''})
            }
            if (props.octave + 1 > octaveMinMax[1]) {
                octaveExists1 = false;
                // octave1 = new Howl({src: ''})
            }
            if (octaveExists0 || octaveExists1) {
                if (fetchedOctaves[props.octave]) {
                    Object.keys(fetchedOctaves[props.octave]).some((key) => {
                        var octave = fetchedOctaves[props.octave][key];
                        if (!octave) {
                            return false;
                        }
                        else if (octave._src === url0 + '.webm' || octave._src === url0 + '.mp3') {
                            var octave0 = octave;
                        }
                        else if (octave._src === url1 || octave._src === url1 + '.webm') {
                            var octave1 = octave;
                        }
                        return octave0 !== undefined && octave1 !== undefined;
                    });
                }
                // else {
                //   // fetchedOctaves[props.volume] = {};
                //   setFetchedOctaves((fetchedOctaves) => ({...fetchedOctaves, [props.octave]: {}}));
                // }
                if (octaveExists0) {
                    var octave0 = new howler_1.Howl({
                        src: [url0 + '.webm', url0 + '.mp3'],
                        sprite: {
                            C: [0, 4999],
                            'C#': [5000, 4999],
                            D: [10000, 4999],
                            Eb: [15000, 4999],
                            E: [20000, 4999],
                            F: [25000, 4999],
                            'F#': [30000, 4999],
                            G: [35000, 4999],
                            'G#': [40000, 4999],
                            A: [45000, 4999],
                            Bb: [50000, 4999],
                            B: [55000, 5000],
                        },
                        onplayerror: function () {
                            octave0.once('unlock', function () {
                                octave0.play();
                            });
                        }
                    });
                    // fetchedOctavesTemp[props.volume] = [];
                    // fetchedOctavesTemp[props.volume][props.octave] = octave0;
                    setFetchedOctaves((fetchedOctaves) => ({ ...fetchedOctaves, [props.octave]: { [props.volume]: octave0 } }));
                }
                if (octaveExists1) {
                    var octave1 = new howler_1.Howl({
                        src: [url1 + '.webm', url1 + '.mp3'],
                        sprite: {
                            C: [0, 4999],
                            'C#': [5000, 4999],
                            D: [10000, 4999],
                            Eb: [15000, 4999],
                            E: [20000, 4999],
                            F: [25000, 4999],
                            'F#': [30000, 4999],
                            G: [35000, 4999],
                            'G#': [40000, 4999],
                            A: [45000, 4999],
                            Bb: [50000, 4999],
                            B: [55000, 5000],
                        },
                    });
                    // fetchedOctavesTemp[props.volume][props.octave + 1] = octave1;
                    // console.log(fetchedOctavesTemp);
                    setFetchedOctaves((fetchedOctaves) => ({ ...fetchedOctaves, [props.octave + 1]: { [props.volume]: octave1 } }));
                }
            }
            // setFetchedOctaves((fetchedOctaves) => ({...fetchedOctaves, [props.octave]: {[props.volume]: octave0}}));
            // setFetchedOctaves((fetchedOctaves) => ({...fetchedOctaves, [props.octave + 1]: {[props.volume]: octave1}}));
            // return [octave0, octave1];
        }
        // console.log(fetchSounds())
        if (octaveMinMax.length === 2) {
            fetchSounds();
        }
    }, [props.sound, props.octave, props.volume]);
    // useEffect(() => {
    //   let elemOctaves = document.getElementById('midi-note-labels');
    //   if(elemOctaves!.querySelectorAll('.note-label-octaves').length === octaveMinMax[1] + 1) {
    //     let elements = elemOctaves!.querySelectorAll('.note-label-octaves')
    //     console.log(elements)
    //     let visibleElems: number[] = [];
    //     elements.forEach((elem) => {
    //       observer.observe(elem)
    //     })
    //   } else {
    //     let elements = elemOctaves!.querySelectorAll('.note-label-octaves')
    //     let mObserver = new MutationObserver(() => {
    //       if(elemOctaves!.querySelectorAll('.note-label-octaves').length === octaveMinMax[1] + 1) {
    //         let elements = elemOctaves!.querySelectorAll('.note-label-octaves')
    //         console.log(elements)
    //         let visibleElems: number[] = [];
    //         elements.forEach((elem) => {
    //           observer.observe(elem)
    //         })
    //       }
    //     })
    //     mObserver.observe(elemOctaves!, {subtree: true, childList: true})
    //   }
    //   let callback = (entries: any, observer: any) => {
    //     entries.forEach((entry: any) => {
    //       console.log(entry.target.getAttribute('id'))
    //       // entry.target.style.backgroundColor = entry.isIntersecting ? 'green' : 'red';
    //       // entry.target.innerHTML = entry.intersectionRatio;
    //     })
    //   }
    //   let observer = new IntersectionObserver(callback, {
    //     threshold: [0.0] // If 50% of the element is in the screen, we count it!
    //     // Can change the thresholds based on your needs. The default is 0 - it'll run only when the element first comes into view
    //   });
    //   // let elements = document.querySelectorAll('.note-label-octaves')
    //   // let elements = document.getElementsByClassName('note-label-octaves')
    //   let elements = document.getElementById('midi-note-labels')!.querySelectorAll('.note-label-octaves')
    //   console.log(elements)
    //   let visibleElems: number[] = [];
    //   elements.forEach((elem) => {
    //     observer.observe(elem)
    //     // let elemId = elem.getAttribute( 'id' );
    //     // if(elemId) {
    //     //   let elemOctave = parseInt(elemId.replace(/\D/g, ''));;
    //     //   if(typeof elemOctave === 'number') {
    //     //     // elemOctave = parseInt(elemId.replace(/\D/g, ''));
    //     //     visibleElems[elemOctave] = (elem.getBoundingClientRect().y);
    //     //   }
    //     // }
    //     // visibleElems[elemOctave] = (elem.getBoundingClientRect().y);
    //     // console.log(elem)
    //   })
    //   // let rect = elem.getBoundingClientRect();
    //   console.log(visibleElems)
    // })
    // useEffect(() => {
    //   // console.error('pianorollnotes', props.pianoRollNotes)
    //   if(true) {
    //     let pianoRollNotesKeys = Object.keys(props.pianoRollNotes);
    //     let pressedKey: string;
    //     // const prevNotesTemp: prevNotes = prevNotes;
    //     let prevKey: string;
    //     pianoRollNotesKeys.some((key: string) => {
    //       if(props.pianoRollNotes[key].pressed || props.pianoRollNotes[key].pianoRoll) {
    //         // console.log(key)
    //         pressedKey = key;
    //         return true;
    //       }
    //       return false;
    //     });
    //     // console.error(keysPressed)
    //     if(pressedKey!) {
    //       // console.log(props.pianoRollNotes)
    //       let octaveSound: any;
    //       let octaveFetched = false;
    //       let url = 'http://localhost:3001/sounds/' + props.sound + '/' + props.pianoRollNotes[pressedKey].octave + '/' + props.volume;
    //       if(fetchedOctaves[props.pianoRollNotes[pressedKey].octave as keyof typeof fetchedOctaves]) {
    //         Object.keys(fetchedOctaves[props.pianoRollNotes[pressedKey].octave as keyof typeof fetchedOctaves]).some((key) => {
    //           octaveSound = fetchedOctaves[props.pianoRollNotes[pressedKey].octave as keyof typeof fetchedOctaves][key];
    //           if(octaveSound._src === url + '.webm' || octaveSound._src === url + '.mp3') {
    //             octaveFetched = true;
    //           }
    //           return octaveFetched;
    //         });
    //       }
    //       if(!octaveFetched) {
    //         octaveSound = new Howl({
    //           src: [url + '.webm', url + 'mp3'],
    //           sprite: {
    //             C: [0, 4999],
    //             'C#': [5000, 4999],
    //             D: [10000, 4999],
    //             Eb: [15000, 4999],
    //             E: [20000, 4999],
    //             F: [25000, 4999],
    //             'F#': [30000, 4999],
    //             G: [35000, 4999],
    //             'G#': [40000, 4999],
    //             A: [45000, 4999],
    //             Bb: [50000, 4999],
    //             B: [55000, 5000],
    //           },
    //         });
    //         // setFetchedOctaves((fetchedOctaves) => ({...fetchedOctaves, [props.volume]: {...fetchedOctaves[props.volume], [props.pianoRollNotes[1]]: octave}}));
    //       }
    //       // qwertyNote.some((key: string) => {
    //       //   if(pressedKey === key) {
    //       //     prevNote = qwertyNote[key].note + props.pianoRollNotes[pressedKey].octave;
    //       //     prevNotesTemp[qwertyNote[prevNote].note + props.pianoRollNotes[pressedKey].octave] = 0;
    //       //     console.log(qwertyNote[prevNote].note)
    //       //     return true
    //       //   }
    //       //   return false;
    //       // });
    //       // setPrevNotes(prevNotesTemp);
    //       setFetchedOctaves((fetchedOctaves) => ({...fetchedOctaves, [props.pianoRollNotes[pressedKey].octave]: {[props.volume]: octaveSound}}));
    //       // console.log(pressedKey)
    //       setKeysPressed((keysPressed) => ({...keysPressed, [pressedKey]: {octave: props.pianoRollNotes[pressedKey].octave, pressed: props.pianoRollNotes[pressedKey].pressed, pianoRoll: true}}));
    //       // octave.play(props.pianoRollNotes[0]);
    //     }
    //   }
    //   // setPrevNotes(prevNotesTemp)
    // }, [props.pianoRollNotes]);
    (0, react_1.useEffect)(() => {
        if (props.pianoRollKey.length > 0) {
            // console.log(props.pianoRollKey)
            let octaveSound;
            let octaveFetched = false;
            let url = 'http://localhost:3001/sounds/' + props.sound + '/' + props.pianoRollKey[1] + '/' + props.volume;
            if (fetchedOctaves[props.pianoRollKey[1]]) {
                Object.keys(fetchedOctaves[props.pianoRollKey[1]]).some((key) => {
                    octaveSound = fetchedOctaves[props.pianoRollKey[1]][key];
                    if (octaveSound._src === url + '.webm' || octaveSound._src === url + '.mp3') {
                        // console.log(fetchedOctaves[props.pianoRollKey[1] as keyof typeof fetchedOctaves][key])
                        octaveFetched = true;
                    }
                    return octaveFetched;
                });
            }
            // console.log(octaveFetched)
            if (!octaveFetched) {
                octaveSound = new howler_1.Howl({
                    src: [url + '.webm', url + 'mp3'],
                    sprite: {
                        C: [0, 4999],
                        'C#': [5000, 4999],
                        D: [10000, 4999],
                        Eb: [15000, 4999],
                        E: [20000, 4999],
                        F: [25000, 4999],
                        'F#': [30000, 4999],
                        G: [35000, 4999],
                        'G#': [40000, 4999],
                        A: [45000, 4999],
                        Bb: [50000, 4999],
                        B: [55000, 5000],
                    },
                });
                setFetchedOctaves((fetchedOctaves) => ({ ...fetchedOctaves, [props.pianoRollKey[1]]: { [props.volume]: octaveSound } }));
            }
        }
    }, [props.pianoRollKey]);
    (0, react_1.useEffect)(() => {
        // console.log('keysPressed', keysPressed)
        if (Object.keys(fetchedOctaves).length > 0) {
            // console.log('e')
            let sound1 = fetchedOctaves[props.octave][props.volume];
            // let sound2 = fetchedOctaves[props.octave + 1][props.volume];
            // keysToPlay = [{'a': {}}]
            // keysPressed
            let id = sound1.play('C');
            sound1.stop(id);
        }
    }, [fetchedOctaves]);
    (0, react_1.useEffect)(() => {
        // function playNote() {
        //   keysPressed.forEach((key) => {
        //     currentOctave[key].play();
        //   })
        // }
        function playNote() {
            // console.log(props.octave)
            let note;
            let octave;
            let noteName;
            const prevNotesTemp = JSON.parse(JSON.stringify(prevNotes));
            // const currOctave = currentOctave;
            console.log(keysPressed);
            // let notes = ['a', 'd', 'g'];
            // console.log(fetchedOctaves[keysPressed[key as keyof typeof keysPressed].octave + octave as keyof typeof fetchedOctaves][props.volume]);
            Object.keys(keysPressed).forEach((key) => {
                // notes.forEach((key) => {
                qwertyNote.forEach((qwerty) => {
                    note = qwerty.note;
                    octave = qwerty.octave;
                    // console.log(fetchedOctaves)
                    if (qwerty.key === key && fetchedOctaves[keysPressed[key].octave + octave][props.volume]) {
                        (note.includes('#')) ? noteName = note.replace('#', 'sharp') + (keysPressed[key].octave + octave) : noteName = note.replace('b', 'flat') + (keysPressed[key].octave + octave);
                        let labelElem = document.getElementById(noteName.toLowerCase() + '-label');
                        // console.log('prevNotes', prevNotes);
                        // console.log('keysPressed', keysPressed, !keysPressed[key as keyof typeof keysPressed].pressed , prevNotes[noteName as keyof typeof prevNotes] > 0);
                        if (keysPressed[key].pressed && (!prevNotes[noteName] || prevNotes[noteName] === 0)) {
                            console.error('is it?');
                            console.log(fetchedOctaves[keysPressed[key].octave + octave][props.volume]);
                            console.error('it is.');
                            let sound = fetchedOctaves[keysPressed[key].octave + octave][props.volume];
                            let soundId = sound.play(note);
                            prevNotesTemp[noteName] = soundId;
                            // setPrevNotes((prevNotes) => ({...prevNotes, [note + octave]: id}))
                            labelElem.classList.toggle('active');
                            // return true;
                        }
                        else if (!keysPressed[key].pressed && prevNotes[noteName] > 0) {
                            // console.log(note)
                            labelElem.classList.toggle('active');
                            Object.keys(prevNotes).some((playedNote) => {
                                if (playedNote === noteName) {
                                    fetchedOctaves[keysPressed[key].octave + octave][props.volume].fade(1, 0, 300, prevNotes[noteName]);
                                }
                            });
                            prevNotesTemp[noteName] = 0;
                            // Object.keys(prevNotesTemp).forEach(key => delete prevNotesTemp[key]);
                            // console.log(typeof prevNotesTemp)
                            // setPrevNotes((prevNotes) => ({...prevNotes, [note + octave]: 0}))
                            // return true;
                        }
                    }
                });
            });
            setPrevNotes(prevNotesTemp);
        }
        // console.log(keysPressed)
        if (Object.keys(keysPressed).length !== 0) {
            // console.log('keysPressed', keysPressed)
            playNote();
            // setKeysPressed({});
        }
    }, [keysPressed]);
    (0, react_1.useEffect)(() => {
        // console.log(Object.keys(props.soundDetails).length)
        if (Object.keys(props.soundDetails).length > 0) {
            let octavesArray = Object.keys(props.soundDetails[props.sound]);
            let octaveNums = [];
            octavesArray.forEach((octave) => {
                octaveNums.push(parseInt(octave));
            });
            // console.log(Math.min(...octaveNums), Math.max(...octaveNums))
            let result = [Math.min(...octaveNums), Math.max(...octaveNums)];
            setOctaveMinMax(result);
        }
    }, [props.soundDetails]);
    function setNoteProps(controller) {
        // console.log('noteOctaves', controller)
        // noteOctaves.forEach((key) => {
        //   setKeysPressed((keysPressed) => [...keysPressed, key]);
        // });
        // console.log('controller', controller)
        setKeysPressed(controller);
        props.onNotePlayed(controller);
    }
    // let piano = qwertyNote.map((keyNote) => {
    //   return <Key key={keyNote.key} qwertyKey={keyNote.key} note={keyNote.note} altNote={keyNote.altNote} octave={keyNote.octave} volume='mf' onNotePlayed={setNoteProps} />
    // });
    // piano.push(<KeyNoteInputField key='KeyNoteInputField' onNotePlayed={setNoteProps} />);
    // return piano;
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)(KeyNoteInput, { octave: props.octave, pianoRollKey: props.pianoRollKey, onNotePlayed: setNoteProps }, 'KeyNoteInput') }));
}
exports.default = Piano;