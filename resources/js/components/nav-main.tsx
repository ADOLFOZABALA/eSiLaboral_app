import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { NavLink, useLocation } from 'react-router-dom';
import useAuthUser from '@/hooks/useAuthUser';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const location = useLocation();
    const user = useAuthUser();

    // ⚠️ Si no hay usuario, no renderiza el menú
    if (!user) return null;

    // ✅ Filtrar ítems por rol del usuario
    const filteredItems = items.filter((item) => {
        // Si el ítem tiene una propiedad "roles" (array), verificamos si el usuario tiene uno de esos roles
        if (item.roles && Array.isArray(item.roles)) {
            return user.role?.name && item.roles.includes(user.role.name);
        }
        return true; // Mostrar si no hay restricción de roles
    });

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {filteredItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={item.href === location.pathname}
                            tooltip={{ children: item.title }}
                        >
                            <NavLink to={item.href}>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </NavLink>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
