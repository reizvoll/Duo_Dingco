import SideNavWrapper from "./SideNavWrapper";

export default function SideNav() {
  return (
    <header className="fixed top-0 left-0 h-screen shadow-lg z-50 flex flex-col items-center py-6">
      <SideNavWrapper />
    </header>
  )
}