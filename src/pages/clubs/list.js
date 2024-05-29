import { React, useState, useEffect } from "react";
import { firestore } from "../../Firebase.js";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import Modal from "./Modal.js";

function List(props) {
  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let clubsData = localStorage.getItem("clubsData");
      if (clubsData) {
        clubsData = JSON.parse(clubsData);
      } else {
        const q = query(collection(firestore, "clubs"), orderBy("ClubName"));
        const querySnapshot = await getDocs(q);
        clubsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Fetched")
        localStorage.setItem("clubsData", JSON.stringify(clubsData));
      }
      setData(clubsData);
    };
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
