import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { CLIENTS, PROFESSIONALS } from '@/lib/data';

export function RecentSales() {
    const recentUsers = [...CLIENTS, ...PROFESSIONALS]
        .sort((a,b) => b.registrationDate.getTime() - a.registrationDate.getTime())
        .slice(0, 5);

  return (
    <div className="space-y-8">
        {recentUsers.map(user => {
            const isProfessional = 'avgRating' in user;
            const key = isProfessional ? `pro-${user.id}` : `client-${user.id}`;
            return (
            <div key={key} className="flex items-center">
                <Avatar className="h-9 w-9">
                <AvatarImage src={user.photoUrl} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-sm text-muted-foreground">
                    {user.email}
                </p>
                </div>
                {isProfessional ? ( 
                    <div className="ml-auto font-medium">+ $15.000,00</div>
                ) : (
                    <div className="ml-auto font-medium text-muted-foreground">Cliente</div>
                )
            }
          </div>
        )})}
    </div>
  );
}
