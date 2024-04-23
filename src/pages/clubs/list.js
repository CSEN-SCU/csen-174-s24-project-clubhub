import { React, useState } from 'react'
import data from "./ClubInfo.json"
import Modal from "./Modal.js"

function List(props) {
    const [openModal, setOpenModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    // Create a new array by filtering the original array
    const filteredData = data.filter((el) => {
        //if no input the return the original
        if (props.input === '') {
            return el;
        }
        //return the item which contains the user input
        else {
            return el.ClubName.toLowerCase().includes(props.input)
        }
    })

    const handleOpenModal = (item) => {
        setSelectedItem(item); // Set the selected item when the modal is opened
        setOpenModal(true); // Open the modal
      };

      const handleCloseModal = () => {
        setOpenModal(false); // Close the modal
        setSelectedItem(null); // Clear the selected item
      };

    return (
        <div>
            {filteredData.map((item) => (
                    <button
                    key={item.ClubName} // Ensure each button has a unique key !!!!!!!!!!
                    className="OpenModalBtn"
                    onClick={() => handleOpenModal(item)}
                    >
                    {item.ClubName} 
                    </button>
                ))}
                {openModal && (
                    <Modal
                    closeModal={handleCloseModal}
                    clubInfo={selectedItem} // Pass the text of the selected item
                    />
                )}
        </div>
    )
}



export default List
