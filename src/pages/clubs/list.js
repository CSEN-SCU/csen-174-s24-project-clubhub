import { React, useState, useEffect } from "react";
import { firestore } from "../../Firebase.js";
import { collection, query, getDocs, orderBy } from "firebase/firestore";
import Modal from "./Modal.js";

function List(props) {
  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const q = query(collection(firestore, "clubs"), orderBy("ClubName"));
    const querySnapshot = await getDocs(q);
    const clubsData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setData(clubsData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = data.filter((el) => {
    if (props.input === "") {
      return el;
    } else {
      return el.ClubName.toLowerCase().includes(props.input.toLowerCase());
    }
  });

  const handleOpenModal = (item) => {
    setSelectedItem(item);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedItem(null);
  };

  return (
    <div>
      {filteredData.map((item) => (
        <button
          key={item.id}
          className="OpenModalBtn"
          onClick={() => handleOpenModal(item)}
        >
          {item.ClubName}
        </button>
      ))}
      {openModal && (
        <Modal closeModal={handleCloseModal} clubInfo={selectedItem} />
      )}
    </div>
  );
}

export default List;
