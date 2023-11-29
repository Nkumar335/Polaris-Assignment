
import React from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'


function ModalContainer({ show =false, setShow = () => {}, setSelectedData = () => {}, transformedArray =[],inputData =[], setInputData =()=> {}}) {

    const handleClose = () => setShow(false);

    const handleChange = (e) => {
        if (e.target.name === "meterNumber") {
            const selectedOptions = Array.from(e.target.selectedOptions);
            const selectedMeterNumbers = selectedOptions.map((option) => option.value);

            setInputData({
                ...inputData,
                meterNumber: selectedMeterNumbers,
            });
        } else {
            setInputData({
                ...inputData,
                [e.target.name]: e.target.value,
            });
        }
    };
    
  const handleSubmit = () => {

    if(transformedArray?.length === 0 ){
        toast.warn('Please Choose CSV file Data Parsing', {position: toast.POSITION.TOP_CENTER})
        return
    }
   
    if(inputData?.startTime === '' || inputData?.endTime === '' || inputData?.meterNumber.length === 0){
        toast.warn('Please fill all inputs !', {position: toast.POSITION.TOP_CENTER});
        return
    }
    const startTimeInHour = inputData?.startTime.split('T')[1].split(':')[0];
    const startTimeInMinute = inputData?.startTime.split('T')[1].split(':')[1];
    const endTimeInHour= inputData?.endTime.split('T')[1].split(':')[0];
    const endTimeInMinute= inputData?.endTime.split('T')[1].split(':')[1];
  
    
    const filteredArray = transformedArray.filter(item => {
      const itemTimestampInHour = item.timestamp.split(' ')[1].split(':')[0];
      const itemTimestampInMinute = item.timestamp.split(' ')[1].split(':')[1];
      return (+itemTimestampInHour >= +startTimeInHour &&  +itemTimestampInMinute >= +startTimeInMinute)&& (+itemTimestampInHour <= +endTimeInHour && +itemTimestampInMinute <= +endTimeInMinute);
    });
  
    setSelectedData(filteredArray);
    setShow(false)
  };
  
    return (
        <>
            <Modal size="lg" show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className='input_element'>
                            <label>Start Time:</label>
                            <input name="startTime" type="datetime-local" min="2023-11-21T10:00"
                                max="2023-11-21T21:58" class="form-control" onChange={handleChange} required />
                        </div>
                        <div className='input_element'>
                            <label>End Time:</label>
                            <input name="endTime" type="datetime-local" min="2023-11-21T10:00"
                                max="2023-11-21T21:58" class="form-control" onChange={handleChange} required />
                        </div>
                        <div className='input_element'>
                            <label>Select Meters:</label>
                            <select name="meterNumber" multiple class="form-control" onChange={handleChange} required>
                                <option>M1</option>
                                <option>M2</option>
                                <option>M3</option>
                                <option>M4</option>
                                <option>Master</option>
                            </select>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalContainer;