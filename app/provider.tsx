"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { UserDetailContext } from "@/context/UserDetailContext";

function Provider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [userDetail, setUserDetail] = useState(null);

  useEffect(() => {
    if (user) {
      createNewUser();
    }
  }, [user]);

  const createNewUser = async () => {
    try {
      const result = await axios.post('/api/users', {
        user: user,
      });
      console.log(result.data);
      setUserDetail(result.data);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      <div>
        {children}
      </div>
    </UserDetailContext.Provider>
  );
}

export default Provider;