
import { 
  Home,
  BarChart3,
  FileText,
  Settings,
  Users,
  Bell,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  SidebarProvider, 
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarSeparator,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger
} from "@/components/ui/sidebar";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="h-screen flex w-full bg-slate-50 dark:bg-slate-950">
        {/* Sidebar */}
        <Sidebar>
          <SidebarHeader className="px-4 py-6">
            <div className="flex items-center gap-2">
              <div className="bg-primary p-1 rounded-md">
                <BarChart3 className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">Dashboard</span>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive tooltip="Dashboard">
                      <Home />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Analytics">
                      <BarChart3 />
                      <span>Analytics</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Reports">
                      <FileText />
                      <span>Reports</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Users">
                      <Users />
                      <span>Users</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            
            <SidebarSeparator />
            
            <SidebarGroup>
              <SidebarGroupLabel>Settings</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Settings">
                      <Settings />
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          
          <SidebarFooter className="p-4">
            <div className="flex flex-col gap-2">
              <SidebarSeparator />
              <div className="flex items-center gap-3 mt-2">
                <div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center">
                  <span className="font-medium text-sm">JD</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">John Doe</span>
                  <span className="text-xs text-muted-foreground">Admin</span>
                </div>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
        
        {/* Main Content */}
        <SidebarInset className="overflow-auto">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <div className="flex flex-1 items-center gap-4 md:gap-8">
              <Input 
                placeholder="Search..." 
                className="h-9 md:w-[200px] lg:w-[300px]"
                type="search" 
              />
              <div className="ml-auto flex items-center gap-2">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                </Button>
              </div>
            </div>
          </header>
          
          <main className="flex-1 p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">Welcome to your dashboard overview.</p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {/* Stat Cards */}
              {['Total Users', 'Active Now', 'Total Revenue', 'Conversion Rate'].map((title, i) => (
                <div key={i} className="rounded-lg border bg-card text-card-foreground shadow p-6">
                  <div className="flex flex-row items-center justify-between pb-2">
                    <h3 className="text-sm font-medium">{title}</h3>
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      ['bg-blue-100', 'bg-green-100', 'bg-amber-100', 'bg-violet-100'][i]
                    }`}>
                      {[<Users />, <Users />, <BarChart3 />, <BarChart3 />][i]}
                    </div>
                  </div>
                  <div className="text-2xl font-bold">
                    {['5,273', '1,234', '$12,456', '32.4%'][i]}
                  </div>
                  <p className={`text-xs ${
                    i % 2 === 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {i % 2 === 0 ? '↑' : '↓'} {['12%', '3%', '8%', '5%'][i]} from last month
                  </p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Content Cards */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-lg border bg-card text-card-foreground shadow">
                  <div className="p-6">
                    <h3 className="text-lg font-medium">Recent Activity {i}</h3>
                    <div className="mt-4 space-y-4">
                      {[1, 2, 3].map((j) => (
                        <div key={j} className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center">
                            <span className="text-sm">U{j}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">User Activity {j}</p>
                            <p className="text-xs text-muted-foreground">Completed task #{j}</p>
                          </div>
                          <div className="ml-auto text-xs text-muted-foreground">
                            {j}h ago
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center border-t p-4">
                    <Button variant="ghost" size="sm" className="ml-auto">
                      View all
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Index;
