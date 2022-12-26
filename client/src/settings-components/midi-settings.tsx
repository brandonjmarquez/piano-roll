import React, {useState, useEffect, useRef} from 'react';
// import  {DraggableNumber} from './libs/draggable-number'
import './settings.css';

interface BpmSliderProps {
  bpm: number;
  midiDispatch: Function;
}

function BpmSlider(props: BpmSliderProps) {
  const [rendered, setRendered] = useState(0);
  const ref = useRef(null);

  // useEffect(() => { 
  //   const el = ref.current;
  //   if(el && rendered === 0) {
  //     console.log('h', rendered, el)
  //     new DraggableNumber(el, {
  //         min: 1,
  //         max: 999,
  //         changeCallback: function(val) {console.log("on change: " + val);},
  //         endCallback: function(val) {console.log("on end: " + val);}
  //     });
  //     setRendered(1);
  //   }
  // }, [ref.current]);

  return <input ref={ref} className="bpm-input" defaultValue={props.bpm} onChange={(e) => props.midiDispatch({type: 'bpm', bpm: parseInt(e.target.value)})} />;
}

interface MidiSettingsProps {
  soundDetails: Object;
  numMeasures: number;
  subdiv: number;
  bpm: number;
  mode: string;
  midiDispatch: Function;
}

function MidiSettings(props: MidiSettingsProps) {

  function renderNumMeasures() {
    var measureOpts = [];
    for(var i = 1; i < 9; i++) {
      measureOpts.push(<option key={i} value={i}>{i}</option>);
    }
    return measureOpts;
  }

  const recordingClassName = `recording-button${(props.mode === 'recording') ? ' active' : ''}`;

  return (
    <>
      <BpmSlider bpm={props.bpm} midiDispatch={props.midiDispatch} />
      <select name='num-measures' id='measure-amt-selector' value={props.numMeasures} onChange={(e) => {props.midiDispatch({type: 'numMeasures', numMeasures: e.target.value})}}>
        {renderNumMeasures()}
      </select>
      <select name='subdiv' id='subdiv-selector' value={props.subdiv} onChange={(e) => {props.midiDispatch({type: 'subdiv', subdiv: parseInt(e.target.value)})}}>
        <option value='1'>1</option>
        <option value='2'>1/2</option>
        <option value='4'>1/4</option>
        <option value='8'>1/8</option>
        <option value='16'>1/16</option>
        <option value='32'>1/32</option>
      </select>
      <button type='button' className={recordingClassName} onClick={() => {props.midiDispatch({type: 'mode', mode: (props.mode === 'keyboard') ? 'recording' : 'keyboard'})}}>O</button>
    </>
    )
}

export default MidiSettings;