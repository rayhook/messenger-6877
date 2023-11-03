import React, { useState } from "react";
import { connect } from "react-redux";
import { Sidebar } from "./index";
import { searchUsers } from "../../store/utils/thunkCreators";
import { clearSearchedUsers } from "../../store/conversations";

const SidebarContainer = (props) => {
  const { searchUsers, clearSearchedUsers } = props;

  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return <Sidebar handleChange={handleChange} searchTerm={searchTerm} />;
};

const mapDispatchToProps = (dispatch) => {
  return {
    searchUsers: (username) => {
      dispatch(searchUsers(username));
    },
    clearSearchedUsers: () => {
      dispatch(clearSearchedUsers());
    }
  };
};

export default connect(null, mapDispatchToProps)(SidebarContainer);
