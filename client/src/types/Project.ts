import Artist from "./Artist";
export default interface Project {
    projectName: string;
    projectOwner: string;
    description: string;
    startDate: string;
    endDate: string;
    thumbImage: string;
    // artists: Artist[];
}