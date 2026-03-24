import { useCallback, useEffect, useState } from "react";
import profileImg from "../../../assets/download.jpeg";
import { Mail, Phone, MapPin, IdCardIcon } from "lucide-react";
import { getUser } from "../../../services/methods";


function ProfileHeader() {
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const fetchUser = useCallback(async () => {
    try {
      const data = await getUser();


      setUser(data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }, []);
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);
  return (
    <div className="profile-card">
      {/* Cover Section */}
      <div className="cover">
        <div className="overlay"></div>

        <div className="profile-info">
          <img src={profileImg} alt="profile" className="profile-img"
            onClick={() => setShowModal(true)}
          />
          {showModal && (
            <div className="img-modal" onClick={() => setShowModal(false)}>
              <span className="close-btn">&times;</span>

              <img
                src={profileImg}
                alt="large"
                className="modal-img"
                onClick={(e) => e.stopPropagation()} // prevent closing when clicking image
              />
            </div>
          )}
          <div className="user-details">
            <h2>
              {user?.name}  <span className="badge">IN</span>
            </h2>
            <p>welcome, {user?.name}!</p>
          </div>
        </div>
      </div>

      {/* Bottom Info Section */}
      <div className="info-row">
        <div className="info-item"><Mail size={16} /> <span>{user?.email}</span></div>
        <div className="info-item"><Phone size={16} /> <span>{user?.phone}</span></div>
        {/* <div className="info-item"><MapPin size={16} /> <span>{user?.city}</span></div> */}
        <div className="info-item"><IdCardIcon size={16} /> <span>{user?.id}</span></div>
      </div>
    </div>
  );
}

export default ProfileHeader;
