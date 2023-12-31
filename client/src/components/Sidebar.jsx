import SidebarLink from "./SidebarLink";

const Sidebar = () => {
  return (
    /* 240px */
    <div className="bg-slate-800 text-white flex flex-col w-60 p-8">
      <div>
        <SidebarLink to=".">Files</SidebarLink>
        <SidebarLink to="profile">Profile</SidebarLink>
        <SidebarLink to="upload">Upload</SidebarLink>
      </div>
    </div>
  );
};

export default Sidebar;
