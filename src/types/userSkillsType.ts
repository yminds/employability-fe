export interface Area {
    name: string;
    rating: "Low" | "Average" | "Good" | "Excellent";
    strengths: string[];
    areas_for_improvement: string[];
}

export interface Interview{
    transcription:{
        role:string;
        message:string;
        timestamp:Date
    }[]
}

export interface UserSkill {
    _id:string;
    user_id: string;
    skill_pool_id: string;
    self_rating?: number;
    verified_rating?: number;
    summary?: string;
    strengths?: string[];
    areas_for_improvement?: string[];
    areas?: Area[]; 
    latest_interview?: Interview;
    interviews?: string[]; 
    is_deleted: boolean;
    goal?: string; 
    user_fundamental_id?: string; 
}

export const UserSkillsIntialValues: UserSkill = {
    _id:"",
    user_id: "", 
    skill_pool_id: "", 
    self_rating: undefined, 
    verified_rating: undefined, 
    summary: "", 
    strengths: [], 
    areas_for_improvement: [], 
    areas: [], 
    interviews: [],
    is_deleted: false, 
    goal: "",
    user_fundamental_id: "", 
};

export interface progressProps{
    areas:Area[]
}