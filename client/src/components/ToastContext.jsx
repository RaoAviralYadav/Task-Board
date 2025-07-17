// import React, { createContext, useContext, useState } from "react";

// const ToastContext = createContext();

// export const useToast = () => useContext(ToastContext);

// export function ToastProvider({ children }) {
//   const [message, setMessage] = useState("");
//   const [visible, setVisible] = useState(false);

//   const showToast = (msg) => {
//     setMessage(msg);
//     setVisible(true);
//     setTimeout(() => setVisible(false), 3000); // 3 sec display
//   };

//   return (
//     <ToastContext.Provider value={{ showToast }}>
//       {children}
//       {visible && (
//         <div className="auth-toast success">
//           ✅ {message}
//         </div>
//       )}
//     </ToastContext.Provider>
//   );
// }
// src/components/ToastContext.jsx
import React, { createContext, useContext, useState } from "react";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);

  const showToast = (msg) => {
    setMessage(msg);
    setVisible(true);
    setTimeout(() => setVisible(false), 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {visible && (
        <div className="auth-toast success">
          ✅ {message}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
