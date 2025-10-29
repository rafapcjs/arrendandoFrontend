import { useProfile } from '../query/profile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../shared/components/ui/card';

export const ProfileCard = () => {
    const { data: profile, isLoading, error } = useProfile();

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
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
                    <CardTitle>Profile</CardTitle>
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
                <CardTitle>Profile</CardTitle>
                <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <div>
                    <span className="font-semibold">Name:</span> {profile.firstName} {profile.lastName}
                </div>
                <div>
                    <span className="font-semibold">Email:</span> {profile.email}
                </div>
                <div>
                    <span className="font-semibold">Role:</span> {profile.role}
                </div>
                <div>
                 </div>
            </CardContent>
        </Card>
    );
};