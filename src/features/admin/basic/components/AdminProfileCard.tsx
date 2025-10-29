import { useAdminProfile } from '../query/profile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../shared/components/ui/card';

export const AdminProfileCard = () => {
    const { data: profile, isLoading, error } = useAdminProfile();

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Admin Profile</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Loading...</p>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Admin Profile</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Error loading profile</p>
                </CardContent>
            </Card>
        );
    }

    if (!profile) {
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Admin Profile</CardTitle>
                <CardDescription>Administrator account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <div>
                    <span className="font-semibold">Name:</span> {profile.firstName} {profile.lastName}
                </div>
                <div>
                    <span className="font-semibold">Email:</span> {profile.email}
                </div>
                <div>
                    <span className="font-semibold">Role:</span> 
                    <span className="ml-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                        {profile.role}
                    </span>
                </div>
                <div>
                 </div>
            </CardContent>
        </Card>
    );
};