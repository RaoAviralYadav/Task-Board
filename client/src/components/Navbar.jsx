import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/board" className="nav-brand">
          Task<span>Board</span>
        </Link>
      </div>

      <div className="nav-right">
        <Link className="nav-item" to="/board">Home</Link>
        <Link className="nav-item" to="/services">Services</Link>
        <Link className="nav-item" to="/contact">Contact</Link>

        {user ? (
          <div className="user-info">
            {user.avatar?.trim() ? (
              <img
                src={user.avatar}
                alt="avatar"
                className="nav-avatar"
              />
            ) : (
              <div className="nav-avatar-initial">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="nav-username">{user.username}</span>
            <button className="nav-btn logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link to="/login">
              <button className="nav-btn">Login</button>
            </Link>
            <Link to="/register">
              <button className="nav-btn nav-btn-outline">Register</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;


// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// import "./Navbar.css";

// function Navbar() {
//   const navigate = useNavigate();
//   const user = JSON.parse(localStorage.getItem("user"));

//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     navigate("/login");
//   };

//   return (
//     <nav className="navbar">
//       <div className="nav-left">
//         <Link to="/board" className="nav-brand">
//           Task<span>Board</span>
//         </Link>
//       </div>

//       <div className="nav-right">
//         <Link className="nav-item" to="/board">Home</Link>
//         <Link className="nav-item" to="/services">Services</Link>
//         <Link className="nav-item" to="/contact">Contact</Link>

//         {user ? (
//           <div className="user-info">
//             <img src={user.avatar || "/default-avatar.png"} alt="avatar" className="nav-avatar" />
//             <span className="nav-username">{user.username}</span>
//             <button className="nav-btn logout-btn" onClick={handleLogout}>Logout</button>
//           </div>
//         ) : (
//           <>
//             <Link to="/login">
//               <button className="nav-btn">Login</button>
//             </Link>
//             <Link to="/register">
//               <button className="nav-btn nav-btn-outline">Register</button>
//             </Link>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// }

// export default Navbar;
