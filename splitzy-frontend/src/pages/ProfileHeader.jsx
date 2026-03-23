import profileImg from "../assets/download.jpeg";

function ProfileHeader() {
  return (
    <div className="profile-card">
      {/* Cover Section */}
      <div className="cover">
        <div className="overlay"></div>

        <div className="profile-info">
          <img src={profileImg} alt="profile" className="profile-img" />


          <div className="user-details">
            <h2>
              Vijay Bokade <span className="badge">IN</span>
            </h2>
            <p>Software Engineer</p>
          </div>
        </div>
      </div>

      {/* Bottom Info Section */}
      <div className="info-row">
        <div className="info-item">📧 vijay@example.com</div>
        <div className="info-item">📞 +91-7574071446</div>
        <div className="info-item">📍 Surat</div>
        <div className="info-item">🆔 2471</div>
      </div>
    </div>
  );
}

export default ProfileHeader;