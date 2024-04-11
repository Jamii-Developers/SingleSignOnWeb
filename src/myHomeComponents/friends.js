import React from "react";
import FriendsNavUtils from "./ComponentUtils/friendsnavutils"

import { Outlet } from "react-router-dom";

const Friends = () => {
  return (
		<div id="FriendsContent">
			<div id = "MyFriendsNavBar">
				< FriendsNavUtils/>
			</div>
			<div id = "MainContent">
				<Outlet/>
			</div>
		</div>
  );
};

export default Friends;