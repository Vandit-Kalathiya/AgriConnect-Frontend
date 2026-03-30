import { NavLink, Outlet } from "react-router-dom";

const tabClass = ({ isActive }) =>
  [
    "whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-green-300",
    isActive
      ? "bg-green-600 text-white"
      : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
  ].join(" ");

const sideNavClass = ({ isActive }) =>
  [
    "block rounded-lg px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-green-300",
    isActive
      ? "bg-green-600 text-white"
      : "text-gray-700 hover:bg-gray-100",
  ].join(" ");

const HistoryTabsLayout = () => {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gray-50 text-gray-900 pb-8 md:ml-14">
      <div className="mx-auto w-full max-w-5xl px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">AI History</h1>
          <p className="text-sm text-gray-600">
            Separate history for Kisan Mitra chat and Crop Advisory.
          </p>
        </div>

        <div className="sticky top-11 z-20 -mx-3 mb-3 border-b border-gray-200 bg-gray-50/95 px-3 py-2 backdrop-blur sm:mx-0 sm:px-0 md:hidden">
          <div className="flex gap-2 overflow-x-auto pb-1">
            <NavLink to="/history/kisan-mitra" className={tabClass}>
              Kisan Mitra
            </NavLink>
            <NavLink to="/history/crop-advisory" className={tabClass}>
              Crop Advisory
            </NavLink>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="hidden md:block">
            <div className="sticky top-20 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
              <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Histories
              </p>
              <nav className="space-y-1">
                <NavLink to="/history/kisan-mitra" className={sideNavClass}>
                  Kisan Mitra History
                </NavLink>
                <NavLink to="/history/crop-advisory" className={sideNavClass}>
                  Crop Advisory History
                </NavLink>
              </nav>
            </div>
          </aside>

          <main>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default HistoryTabsLayout;
