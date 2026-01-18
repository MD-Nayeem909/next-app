import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PackageCheck,
  Package,
  Users,
  History,
  LogOut,
  Truck,
  X,
  Menu,
} from "lucide-react";
import Logo from "../shared/Logo";

const Sidebar = ({ user, isOpen, setIsOpen }) => {
  const pathname = usePathname();

  const menuItems = {
    admin: [
      { name: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
      {
        name: "All Parcels",
        href: "/dashboard/admin/all-parcels",
        icon: Package,
      },
      { name: "Manage Agents", href: "/dashboard/admin/users", icon: Users },
    ],
    agent: [
      { name: "Overview", href: "/dashboard/agent", icon: LayoutDashboard },
      { name: "My Tasks", href: "/dashboard/agent/tasks", icon: Truck },
      {
        name: "Delivery History",
        href: "/dashboard/agent/history",
        icon: History,
      },
      {
        name: "My Deliveries",
        href: "/dashboard/agent/my-deliveries",
        icon: PackageCheck,
      },
    ],
    customer: [
      {
        name: "Overview",
        href: "/dashboard/customer",
        icon: LayoutDashboard,
      },
      {
        name: "Create Parcel",
        href: "/dashboard/customer/create-parcel",
        icon: Package,
      },
      {
        name: "My Parcels",
        href: "/dashboard/customer/my-parcels",
        icon: Truck,
      },
    ],
  };

  const currentMenu = menuItems[user?.role] || menuItems.customer;

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-100 w-72 bg-base-100/80 border-r border-base-300 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="h-full flex flex-col p-6">
        <div className="flex items-center justify-between mb-10">
          <Logo />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 hover:bg-base-300 rounded-lg"
          >
            {isOpen && <X size={24} /> }
          </button>
        </div>

        <nav className="flex-1 space-y-1">
          {currentMenu.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all ${
                pathname === item.href
                  ? "bg-primary/10 text-primary font-bold"
                  : "text-neutral hover:text-base-content hover:bg-base-300"
              }`}
            >
              <item.icon size={20} />
              {item.name}
            </Link>
          ))}
        </nav>

        <button className="flex items-center gap-3 px-4 py-3 text-primary hover:bg-primary/10 rounded-md mt-auto font-medium">
          <LogOut size={20} /> Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
