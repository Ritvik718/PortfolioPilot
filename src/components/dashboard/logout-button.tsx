'use client';

import { SidebarMenuButton } from '@/components/ui/sidebar';
import { LogOut } from 'lucide-react';
import { logout } from '@/app/actions';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export function LogoutButton() {
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
      router.push('/login');
    } else {
      toast({
        variant: 'destructive',
        title: 'Logout Failed',
        description: result.message,
      });
    }
  };

  return (
    <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
      <LogOut />
      <span>Logout</span>
    </SidebarMenuButton>
  );
}
