import { NavLink } from 'react-router-dom';
import { useNav } from './useNav';
export default function BottomNav() {
  const items = useNav();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background md:hidden">
      <ul className="mx-auto grid max-w-md py-2" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
        {items.map(({ to, Icon, label }) => (
          <li key={to}><NavLink to={to} end className={({ isActive }) => `flex flex-col items-center gap-1 text-[11px] font-semibold ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
            <Icon className="h-6 w-6" />{label}</NavLink></li>
        ))}
      </ul>
    </nav>
  );
}
