import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';

const RadioButtons = ({ radioNme, setRadioNme, radios }) => {
  return (
    <ButtonGroup className='bg-white'>
      {
        radios.map(radio => {
          return (
            <ToggleButton
              key={`radio-${radio}`}
              id={`radio-${radio}`}
              type="radio"
              variant={radioNme === radio ? 'outline-primary' : 'outline-secondary'}
              name="radio"
              value={radio}
              checked={radioNme === radio}
              onChange={(e) => setRadioNme(e.currentTarget.value)}
            >
              {radio}
            </ToggleButton>
          )
        })
      }
    </ButtonGroup>  
  )
}

export default RadioButtons


// const ToggleButtons = ({ radioNme, setRadioNme, radios }) => {

//     return (
//       <>

//       </>
//   )
// }

// export default ToggleButtons