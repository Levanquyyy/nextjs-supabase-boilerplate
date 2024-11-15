'use client';

import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import {SupabaseClient, User} from '@supabase/supabase-js';
import {useState, Suspense, useEffect} from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Briefcase, Mail, Phone, MapPin, Calendar } from 'lucide-react'
import {useTenant} from "@/utils/tenant-context";
import {createClient} from "@/utils/supabase/client";
import {getProjects} from "@/utils/supabase/queries";

interface DashboardLayoutProps {
    user: User;
}

export function InfoLayout({ user }: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('details')
    const [clientProjects, setClientProjects] = useState<Project[]>([]);
    const { currentTenant } = useTenant();
    const supabase: SupabaseClient = createClient();
    useEffect(() => {
        const res = async () => {
            const supabase: SupabaseClient = createClient();
            if (!currentTenant) {
                return;
            }
            const data = await getProjects(supabase, currentTenant.id);
            if (data && data.projects) {
                setClientProjects(data.projects);
            }
        };
        res();
    }, [currentTenant]);
    return (

        <div className="flex h-screen bg-background">
            {/* Mobile sidebar */}
            <div className={`
        fixed inset-0 z-50 lg:hidden
        ${sidebarOpen ? "block" : "hidden"}
      `}>
                <div className="fixed inset-0 bg-gray-600/75" onClick={() => setSidebarOpen(false)} />
                <div className="fixed inset-y-0 left-0 w-64">
                    <Sidebar onClose={() => setSidebarOpen(false)} />
                </div>
            </div>

         
            <div className="hidden lg:block">
                <Sidebar />
            </div>

            <div className="flex flex-col flex-1 min-w-0">
                <Navbar user={user} onMenuClick={() => setSidebarOpen(true)} />
                <main className="flex-1 p-4 md:p-8 overflow-auto">
                    <Suspense fallback={<div>Loading...</div>}>
                        <div className="container mx-auto p-4 space-y-6">
                            <Card>
                                <CardHeader className="flex flex-col sm:flex-row items-center gap-4">
                                    <Avatar className="w-24 h-24">
                                        <AvatarImage src={user.logo} alt={user.email}/>
                                        <AvatarFallback>{user.email?.substring(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div className="text-center sm:text-left">
                                        <CardTitle className="text-2xl">{user.email}</CardTitle>
                                        <CardDescription>{user.email}</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                                        <Button variant="outline" onClick={() => setActiveTab('details')}>
                                            Client Details
                                        </Button>
                                        <Button variant="outline" onClick={() => setActiveTab('projects')}>
                                            Projects
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {activeTab === 'details' && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Client Details</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <Mail className="text-muted-foreground"/>
                                            <span>{user.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone className="text-muted-foreground"/>
                                            <span> số điện thoại: {user.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="text-muted-foreground"/>
                                            <span>{user.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Briefcase className="text-muted-foreground"/>
                                            <span>{user.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="text-muted-foreground"/>
                                           <span>Joined on {user.email_confirmed_at ? new Date(user.email_confirmed_at).toLocaleDateString() : 'N/A'}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {activeTab === 'projects' && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Client Projects</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Project Name</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead>Start Date</TableHead>
                                                    <TableHead>End Date</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {clientProjects.map((project) => (
                                                    <TableRow key={project.id}>
                                                        <TableCell>{project.name}</TableCell>
                                                        <TableCell>
                                                            <Badge
                                                                variant={project.deal_status === "PENDING" ? 'default' : 'secondary'}>
                                                                {project.deal_status}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>{new Date(project.start_date).toLocaleDateString()}</TableCell>
                                                        <TableCell>{new Date(project.end_date).toLocaleDateString()}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </Suspense>
                </main>
            </div>
        </div>
    );
}
