// src/context/GuestContext.jsx
// Lightweight guest identity — no auth, just name + phone stored locally
import React, { createContext, useContext, useState, useEffect } from "react";

const GuestContext = createContext();

export const useGuest = () => useContext(GuestContext);

export const GuestProvider = ({ children }) => {
  const [guest, setGuest] = useState(() => {
    try {
      const saved = localStorage.getItem("guestInfo");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Persist whenever guest info changes
  useEffect(() => {
    if (guest) {
      localStorage.setItem("guestInfo", JSON.stringify(guest));
    } else {
      localStorage.removeItem("guestInfo");
    }
  }, [guest]);

  const saveGuest = (name, phone) => {
    const info = { name: name.trim(), phone: phone.trim() };
    setGuest(info);
    return info;
  };

  const clearGuest = () => setGuest(null);

  return (
    <GuestContext.Provider value={{ guest, saveGuest, clearGuest }}>
      {children}
    </GuestContext.Provider>
  );
};
