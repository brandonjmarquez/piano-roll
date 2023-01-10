import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import {NoteTrackProps, GridProps} from '../Tools/Interfaces';
import './Grid.css';
const qwertyNote = require('../Tools/note-to-qwerty-key');

function Grid(props: GridProps) {
  const [grid, setGrid] = useState<JSX.Element[]>();
  const noteTracksRef = useCallback((node: HTMLDivElement): void => {
    props.setNoteTracks(node.children);
  }, [])

  useLayoutEffect(() => {
    let gridMidi = [];
    let gridSubdivisions = [];
    let gridMeasure = [];

    for(var x = props.octaveArray.length - 1; x >= 0; x--) {
      for(var y = 11; y >= 0; y--) {
        // gridMeasure.push(<NoteTrack key={qwertyNote[y].note + props.octaveArray[x]} note={qwertyNote[y].note} octave={parseInt(props.octaveArray[x])} subdiv={props.subdiv} />);
        gridMeasure.push(<div key={qwertyNote[y].note + props.octaveArray[x]} id={`${qwertyNote[y].note + props.octaveArray[x]}-track`} className='note-track'></div>);
      }
    }

    for(var i = 0; i < props.subdiv * props.numMeasures; i++) {
      if(i % props.subdiv === 0) {
        gridSubdivisions.push(<span key={i} id={'subdiv-' + (i + 1)} className='subdivision' style={{borderLeft: 'solid 3px rgb(114, 114, 114)'}}></span>)
      } else {
        gridSubdivisions.push(<span key={i} id={'subdiv-' + (i + 1)} className='subdivision'></span>);
      }
    }
    
    if(gridMeasure.length === 12 * props.octaveArray.length) {
      var i = 0;

      gridMidi.push(<div key='subdivs' id='subdivs' style={{gridTemplateColumns: `repeat(${props.subdiv * props.numMeasures}, ${1000 / (props.numMeasures * props.subdiv)}px)`}}>{gridSubdivisions}</div>)
      gridMidi.push(<div key='note-tracks' ref={props.noteTracksRef} id='note-tracks' style={{/*backgroundSize: bgSizeTrack / props.subdiv + '%'*/}}>{gridMeasure}</div>);
      setGrid(gridMidi);
    }
  }, [props.subdiv, props.octaveArray, props.numMeasures]);

  function trackPosition() {
    let position = {};
    if(props.noteTracksRef.current) {
      position = {left: `${(props.pulseNum / (props.midiLength * props.pulseRate)) * props.noteTracksRef.current.offsetWidth}px`};
    } else {
      position = {left: `${(6 + props.pulseNum / (props.midiLength * props.pulseRate) * 94)}%`};
    }
    return <div id='track-position' className='keyboard' style={position}></div>;
  }

  const bgSizeTrack = 100 / props.numMeasures;
  
  return (
    <>
      {trackPosition()}
      {grid}
    </>
  )
}

export default Grid;