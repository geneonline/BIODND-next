import React, { useState, useCallback } from "react";
import { Outlet } from "react-router-dom";

const User = () => {
  return (
    <div className=" w-full ">
      <Outlet />
    </div>
  );
};

export default User;
