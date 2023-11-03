import React, { useState } from "react";
import { Sidebar } from "./index";

const SidebarContainer = (props) => {
  const { searchUsers, clearSearchedUsers } = props;

  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return <Sidebar handleChange={handleChange} searchTerm={searchTerm} />;
};

export default SidebarContainer;
