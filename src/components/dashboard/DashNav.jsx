import React from "react";
import { Bell, Menu, User, X } from "lucide-react";
import ProfileDropdown from "../shared/ProfileDropdown";

const DashNav = ({ user, isSidebarOpen, setSidebarOpen }) => {
  return (
    <header className="h-20 bg-base-100/50 backdrop-blur-md border-b border-base-300 sticky top-0 z-999 px-6 flex items-center justify-between">
      <button
        onClick={() => setSidebarOpen(!isSidebarOpen)}
        className="lg:hidden p-2 hover:bg-base-300 rounded-lg"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className="ml-auto flex items-center gap-4">
        <button className="p-2 text-neutral hover:text-base-content relative">
          <Bell size={22} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-base-300"></span>
        </button>

        <div className="h-8 w-px bg-base-content/50 mx-2"></div>

        <div className="flex items-center gap-3 text-right">
          <div className="hidden sm:block">
            <p className="text-sm font-bold text-base-content leading-none">
              {user?.name}
            </p>
            <p className="text-[10px] text-neutral uppercase font-bold tracking-wider mt-1">
              {user?.role}
            </p>
          </div>
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
};

export default DashNav;
