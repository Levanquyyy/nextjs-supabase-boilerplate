
import { createClient } from '@/utils/supabase/server';
import {getProject, getProjects, getUser} from '@/utils/supabase/queries';
import AddClientForm from '@/components/misc/AddClientForm';
import { redirect } from 'next/navigation';
import { InfoLayout } from '@/components/layout/InfoLayout';
import { SupabaseClient } from '@supabase/supabase-js';
import { toast } from '@/components/ui/use-toast';
// import {useTenant} from "@/utils/tenant-context";

export default async function InfoHistory({ params }: { params: { id: string } }) {
  const supabase: SupabaseClient = createClient();
  // const { currentTenant } = useTenant();
  let user;
  console.log(params.id);
  // console.log(currentTenant.id);

  try {
    user = await getUser(supabase);
    if (!user) {
      return redirect('/clients');
    }


    // const result = await getProjectsById(supabase, user.id);
    // const projectsData = result?.projectsbyid;
    // if (projectsData) {
    //   console.log("Project data:", projectsData);
    // } else {
    //   console.log('No projects found');
    // }

  } catch (error) {
    console.error("Error fetching user:", error);
    toast({
      title: "Error",
      description: "Failed to fetch user data. Please try again.",
      variant: "destructive",
    });
    return redirect('/clients');
  }

  if (!user) {
    return redirect('/auth/signin');
  }
  console.log(user);

  return (
    <div className="h-screen">
      <InfoLayout user={user} >

      </InfoLayout>
      {/*<h1>Hello</h1>*/}
    </div>
  );
}
