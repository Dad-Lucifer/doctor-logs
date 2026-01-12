import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Lock, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Hardcoded authentication as per requirements
        // In a production environment, this should verify against a secure backend service
        setTimeout(() => {
            if (email.toLowerCase() === 'doc@gmail.com' && password === 'Admin-Doc') {
                localStorage.setItem('isAuthenticated', 'true');
                toast({
                    title: 'Welcome back',
                    description: 'Successfully logged in.',
                });
                navigate('/');
            } else {
                toast({
                    title: 'Authentication Failed',
                    description: 'Invalid email or password. Please try again.',
                    variant: 'destructive',
                });
            }
            setIsLoading(false);
        }, 1000); // Fake network delay for better UX
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-300">
                <div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
                    {/* Header */}
                    <div className="p-8 pb-6 text-center border-b border-border bg-muted/20">
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20 mb-6">
                            <Activity className="h-8 w-8 text-primary-foreground" />
                        </div>
                        <h1 className="text-2xl font-bold text-foreground mb-2">MediRecord</h1>
                        <p className="text-muted-foreground text-sm">Sign in to access patient records</p>
                    </div>

                    {/* Form */}
                    <div className="p-8">
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="email"
                                        placeholder="doc@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10 h-11"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground ml-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="password"
                                        placeholder="Enter parameters"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10 h-11"
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-11 mt-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all font-medium"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Authenticating...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Sign In <ArrowRight className="h-4 w-4" />
                                    </span>
                                )}
                            </Button>
                        </form>
                    </div>

                    <div className="p-4 text-center bg-muted/30 border-t border-border">
                        <p className="text-xs text-muted-foreground">
                            Restricted access. Authorized personnel only.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
