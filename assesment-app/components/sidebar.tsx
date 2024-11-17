import { Check, X } from "lucide-react"
import { auth } from "@/auth"
import {
    Sidebar,
    SidebarContent,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarGroup,
    SidebarHeader,
} from "@/components/ui/sidebar"
import ProgressChart from "./progress-chart"
import { getAllAssesmentsByUser, getAllPairs } from "@/db/queries"
import Link from "next/link"

export async function AppSidebar() {
    const session = await auth();
    if (!session) {
        return null;
    }
    const [allPairs, allUserAssessments] = await Promise.all([
        getAllPairs(),
        getAllAssesmentsByUser(session!.user.id),
    ]);

    const assessmentMap = new Map(allUserAssessments.map((assessment) => [assessment.pairId, assessment]));

    return (
        <div className="h-0">
            <Sidebar>
                <SidebarHeader>
                    <ProgressChart completed={allUserAssessments.length} total={allPairs.length} />
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel className="text-xl">Assessments</SidebarGroupLabel>
                        {allPairs.map((pair) => {
                            const assessment = assessmentMap.get(pair.id);
                            let bgColor = "";
                            if (assessment?.value === 0) {
                                bgColor = "bg-red-200";
                            }
                            else if (assessment?.value === 1) {
                                bgColor = "bg-yellow-200";
                            }
                            else if (assessment?.value === 2) {
                                bgColor = "bg-green-200";
                            }

                            return (
                                <SidebarGroupContent
                                    key={pair.id}
                                    className={`border rounded-lg h-16 text-lg font-semibold my-2 ${bgColor} bg-opacity-30`}
                                >
                                    <Link href={`/assessment?pair=${pair.id}`} className="flex items-center justify-between w-full h-full px-4">
                                        <p className="max-w-[85%] break-words text-nowrap truncate">
                                            {pair.id}. {pair.queryTitle[0].toUpperCase() + pair.queryTitle.slice(1)}
                                        </p>
                                        {assessment !== undefined ? (
                                            <Check />
                                        ) : (
                                            <X />
                                        )}
                                    </Link>
                                </SidebarGroupContent>
                            );
                        })}
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
        </div>
    );
}
