import profileImg from "../../../assets/download.jpeg";
import { Mail, Phone, MapPin, IdCardIcon } from "lucide-react";

function ProfileHeader({ user }) {
  return (
    <div className="profile-card">
      {/* Cover Section */}
      <div className="cover">
        <div className="overlay"></div>

        <div className="profile-info">
          <img src={profileImg} alt="profile" className="profile-img" />

          <div className="user-details">
            <h2>
              {user?.name}  <span className="badge">IN</span>
            </h2>
            <p>welcome back, {user?.name}!</p>
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
