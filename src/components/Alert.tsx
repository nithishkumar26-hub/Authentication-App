import React, { useEffect } from 'react';

interface AlertProps {
  message: string;
  alert: boolean;
  setAlert: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Alert: React.FC<AlertProps> = ({ message, alert, setAlert }) => {
    //useEffect hook for clear alert after 3 seconds
    useEffect(() => {
        const timeout = setTimeout(() => {
        if (alert) {
            setAlert(false);
        }
        }, 3000);
        
        return () => clearTimeout(timeout);
    }, [alert, setAlert]);

  const handleClose = () => {
    setAlert(false); // Trigger close and then auto-reset it
  };

  return (
    alert ? (
      <div className="flex justify-center w-full z-10 pt-5 fixed font-roboto">
        <div className="h-10 bg-[#7958D2] text-white rounded shadow-md flex justify-between items-center px-3">
          <p className="px-4">{message}</p>
          <button onClick={handleClose}>&#10005;</button>
        </div>
      </div>
    ) : null
  );
};
