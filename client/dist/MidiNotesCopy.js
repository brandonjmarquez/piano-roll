"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_dom_1 = require("react-dom");
require("./MidiNotes.css");
// const myWorker = new Worker('./ToolComponents/midiNoteWorker')
const qwertyNote = require('./note-to-qwerty-key-obj');
function MidiNotes(props) {
    const [count, setCount] = (0, react_1.useState)(0);
    const [widths, setWidths] = (0, react_1.useState)({});
    const [clickCoords, setClickCoords] = (0, react_1.useState)([]);
    const [midiNoteProps, setMidiNoteProps] = (0, react_1.useState)({});
    const [midiNotes, setMidiNotes] = (0, react_1.useState)([]);
    const [notesRemoved, setNotesRemoved] = (0, react_1.useState)([]);
    // const Portal = usePortal(document.querySelector('.noteTrack'));
    (0, react_1.useEffect)(() => {
        console.log(midiNotes);
    }, [midiNotes]);
    (0, react_1.useEffect)(() => {
        console.error(widths);
    }, [widths]);
    // Notes clicked onto grid
    (0, react_1.useEffect)(() => {
        function addRemNote(e) {
            var elem;
            if (e.target) {
                elem = e.target;
                if (elem.tagName == "DIV") {
                    setClickCoords([e.clientX, e.clientY]);
                }
                else if (elem.tagName == "SPAN") {
                    let key = elem.id.substring(0, elem.id.indexOf('-'));
                    setNotesRemoved((notesRemoved) => [{ [key]: midiNoteProps[key] }, ...notesRemoved]);
                    setMidiNoteProps((midiNoteProps) => {
                        const state = { ...midiNoteProps };
                        delete state[key];
                        return state;
                    });
                    setMidiNotes([]);
                    // elem.remove();
                }
            }
        }
        if (props.noteTracksRef.current) {
            props.noteTracksRef.current.addEventListener('dblclick', addRemNote);
        }
        return () => {
            if (props.noteTracksRef.current)
                props.noteTracksRef.current.removeEventListener('dblclick', addRemNote);
        };
    });
    (0, react_1.useEffect)(() => {
        if (Object.keys(notesRemoved).length > 0) {
            console.log(notesRemoved[0]);
            let key = Object.keys(notesRemoved[0])[0];
            let start = notesRemoved[0][key].keyPressed.start;
            let end = notesRemoved[0][key].keyPressed.end;
            let noteOct = key.replace(start.toString(), '');
            console.log(key[0]);
            console.log(notesRemoved[0][key].keyPressed.start);
            Object.keys(qwertyNote).forEach((qwerty) => {
                if (qwertyNote[qwerty].note === noteOct.replace(/[0-9]/g, '') && qwertyNote[qwerty].octave === 0) {
                    props.onNoteRemoved(key, noteOct, start, end);
                }
            });
        }
    }, [notesRemoved]);
    (0, react_1.useEffect)(() => {
        function renderPortals() {
            const noteTrackChilds = {};
            const midiNotesArr = [];
            Object.keys(midiNoteProps).forEach((noteProps) => {
                var elem = (0, react_1.createElement)('span', { ...midiNoteProps[noteProps].props, key: midiNoteProps[noteProps].key });
                if (!noteTrackChilds[midiNoteProps[noteProps].noteTrackId]) {
                    noteTrackChilds[midiNoteProps[noteProps].noteTrackId] = [];
                }
                noteTrackChilds[midiNoteProps[noteProps].noteTrackId].push(elem);
            });
            Object.keys(noteTrackChilds).forEach((noteTrackId) => {
                midiNotesArr.push((0, react_dom_1.createPortal)(noteTrackChilds[noteTrackId], props.noteTracksRef.current.children.namedItem(noteTrackId)));
            });
            return midiNotesArr;
        }
        if (Object.keys(midiNoteProps).length > 0) {
            setMidiNotes(renderPortals());
        }
    }, [midiNoteProps]);
    // Notes recorded onto grid
    (0, react_1.useEffect)(() => {
        // console.log(clickCoords)
        if (props.noteTracksRef.current) {
            let noteTrackElem;
            let noteTrackId = '';
            let subdivElem;
            let subdivId = '';
            let countTemp = count;
            // console.log('pp')
            document.elementsFromPoint(clickCoords[0], clickCoords[1]).forEach((elem) => {
                if (elem.getAttribute('class') === 'note-track') {
                    // console.log('note')
                    noteTrackElem = elem;
                    noteTrackId = elem.id;
                    console.log(elem);
                }
                if (elem.getAttribute('class') === 'subdivision') {
                    // console.log(midiNoteProps)
                    subdivElem = elem;
                    subdivId = elem.id;
                }
            });
            // console.log(noteTrackId, subdivId)
            if (noteTrackId.length > 0 && subdivId.length > 0) {
                let noteOct = noteTrackId.replace('-track', '');
                let subdiv = parseInt(subdivId.replace(/\D/g, ''));
                // console.log('rect')
                let rect = subdivElem.getBoundingClientRect();
                // console.log(rect)
                // console.log(props.noteTracksRef.current!.children)
                let left = rect.left + 1;
                let width = rect.right - rect.left;
                if ((subdiv - 1) % props.subdiv === 0) {
                    left += 2;
                    width -= 2;
                }
                let start = Math.trunc((left - .08 * window.innerWidth) / props.noteTracksRef.current.offsetWidth * (props.midiLength * props.pulseRate));
                let end = Math.trunc((left + width - .08 * window.innerWidth) / props.noteTracksRef.current.offsetWidth * (props.midiLength * props.pulseRate));
                setMidiNoteProps((midiNoteProps) => ({ ...midiNoteProps, [start + noteOct]: {
                        key: noteTrackId + countTemp,
                        props: {
                            id: start + noteTrackId + '-' + countTemp,
                            className: 'midi-note',
                            style: {
                                height: `${props.noteTracksRef.current.offsetHeight / props.noteTracksRef.current.children.length - 2}px`,
                                left: `${left / props.noteTracksRef.current.offsetWidth * 92}%`,
                                width: `${width - 1}px`,
                            },
                        },
                        keyPressed: {
                            octave: parseInt(noteOct.replace(/\D/g, '')),
                            pressed: true,
                            start: start,
                            end: end,
                        },
                        noteTrackId: noteTrackId,
                        noteTracksRef: props.noteTracksRef,
                    } }));
                Object.keys(qwertyNote).forEach((qwerty) => {
                    if (qwertyNote[qwerty].note === noteOct.replace(/[0-9]/g, '') && qwertyNote[qwerty].octave === 0) {
                        // console.warn(qwertyNote[qwerty]);
                        props.onNoteClicked(noteOct, {
                            key: qwerty,
                            octave: parseInt(noteOct.replace(/\D/g, '')),
                            pressed: true,
                            start: start,
                            end: -1,
                        }, {
                            key: qwerty,
                            octave: noteOct.replace(/\D/g, ''),
                            pressed: false,
                            start: start,
                            end: Math.trunc((left - .08 * window.innerWidth) / props.noteTracksRef.current.offsetWidth * (props.midiLength * props.pulseRate) + width / props.noteTracksRef.current.offsetWidth * (props.midiLength * props.pulseRate) - 1),
                        });
                    }
                });
                countTemp++;
                setCount(countTemp);
            }
        }
    }, [clickCoords]);
    // Notes recorded from keyboard
    (0, react_1.useEffect)(() => {
        Object.keys(props.keysPressed).forEach((noteOct) => {
            // setWidths()
            if (props.keysPressed[noteOct].start) {
                if (props.keysPressed[noteOct].end === -1 && !widths[props.keysPressed[noteOct].start + noteOct]) {
                    setWidths((widths) => ({ ...widths, [props.keysPressed[noteOct].start + noteOct]: { start: props.keysPressed[noteOct].start } }));
                }
                else {
                    setWidths((widths) => ({ ...widths, [props.keysPressed[noteOct].start + noteOct]: { start: props.keysPressed[noteOct].start, end: props.pulseNum } }));
                }
            }
        });
    }, [props.pulseNum, props.keysPressed]);
    (0, react_1.useEffect)(() => {
        // console.warn(widths)
    }, [widths]);
    (0, react_1.useEffect)(() => {
        const addNoteBox = () => {
            let key;
            let octave;
            let countTemp = count;
            if (props.noteTracksRef.current) {
                Object.keys(props.keysPressed).forEach((noteOct) => {
                    octave = parseInt(noteOct.replace(/\D/g, ''));
                    // console.log(widths)
                    let noteStart = props.keysPressed[noteOct].start + noteOct;
                    // console.log(widths[noteStart].start)
                    if (props.keysPressed[noteOct].pressed && widths[noteStart].start !== undefined) {
                        // console.log(widths)
                        let width;
                        // console.error(widths)
                        if (widths[noteStart].end) {
                            width = widths[noteStart].end - widths[noteStart].start;
                        }
                        else {
                            width = props.pulseNum - widths[noteStart].start;
                            // console.log(props.pulseNum , widths[noteStart].start)
                        }
                        let noteTrackId = `${noteOct}-track`;
                        // console.error(width / (props.midiLength * props.pulseRate) * props.noteTracksRef.current!.offsetWidth)
                        setMidiNoteProps((midiNoteProps) => ({ ...midiNoteProps, [props.keysPressed[noteOct].start + noteOct]: {
                                key: noteTrackId + countTemp,
                                props: {
                                    id: props.keysPressed[noteOct].start + noteTrackId + '-' + countTemp,
                                    className: 'midi-note',
                                    style: {
                                        height: `${props.noteTracksRef.current.offsetHeight / props.noteTracksRef.current.children.length - 4}px`,
                                        left: `${.08 * window.innerWidth + (props.keysPressed[noteOct].start / (props.midiLength * props.pulseRate)) * props.noteTracksRef.current.offsetWidth + 2}px`,
                                        width: `${width / (props.midiLength * props.pulseRate) * props.noteTracksRef.current.offsetWidth - 3}px`,
                                    }
                                },
                                keyPressed: props.keysPressed[noteOct],
                                noteTrackId: noteTrackId,
                                noteTracksRef: props.noteTracksRef,
                            } }));
                        countTemp++;
                        setCount(countTemp);
                    }
                });
            }
            // setCount(countTemp)
        };
        // console.log(props.noteTracksRef.current?.children)
        if (props.noteTracksRef && props.midiState.mode === 'recording') {
            addNoteBox();
        }
        if (props.midiState.mode != 'recording') {
            // setMidiNotesArr(Object.keys(midiNotes).map((element) => midiNotes[element]));
        }
        // console.warn(midiNotesArr, props.midiState.mode)
    }, [props.noteTracksRef, props.midiState.mode, widths]);
    // const items = midiNotesArr.map((items) => (<>{items}</>));
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: midiNotes }));
}
exports.default = MidiNotes;
