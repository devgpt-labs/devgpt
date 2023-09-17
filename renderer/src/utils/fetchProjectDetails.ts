import { supabase } from "@/src/utils/supabase/supabase";

const fetchProjectDetails = async (project_id: string) => {
    if (supabase) {
       const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('project_id', project_id)
        .single()
        if (error) {
            console.error(error)
            return false
        }
        if (data) {
            return data
        }
    } else {
        return false 
    }
}

export default fetchProjectDetails;