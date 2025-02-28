import { useState, useEffect } from "react";
import { AddReportButton } from "@/components/AddReportButton";
import { StatusTimeline } from "@/components/StatusTimeline";
import { useToast } from "@/components/ui/use-toast";
import { MetricsOverview } from "@/components/MetricsOverview";
import { AddReportForm } from "@/components/AddReportForm";
import { Listbox } from "@headlessui/react";
import { Check, ChevronDown } from "lucide-react";

// (1) Import our reusable fetch function and types
import { fetchProjectsList, Project, Status } from "@/lib/fetchRagData";
import { Search } from "lucide-react";

const Index = () => {
  const { toast } = useToast();

  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedProjectLink, setSelectedProjectLink] = useState<string>("");
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [isAddingReport, setIsAddingReport] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  // (2) Use the reusable fetch function
  useEffect(() => {
    const getProjects = async () => {
      try {
        const projectsList = await fetchProjectsList();
        setProjects(projectsList);
        if (projectsList.length > 0) {
          setStatuses(projectsList[0].statuses.slice(0, 5));
          setSelectedProject(projectsList[0]);
          setSelectedProjectLink(projectsList[0].link);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error fetching data",
          description: "There was an issue fetching the status data.",
        });
      }
    };

    getProjects();
  }, [toast]);

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle project selection change (now accepts a Project object)
  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    setStatuses(project.statuses.slice(0, 5));
    setSelectedProjectLink(project.link);
  };

  // Handle adding a new status report
  const handleAddReport = ({
    status,
    comment,
  }: {
    status: "Green" | "Amber" | "Red";
    comment: string;
  }) => {
    const newStatus: Status = {
      date: new Date().toISOString(),
      status,
      reporter: "Abdullahi Abdi",
      comment,
    };

    // Append to the selected project's status list
    const updatedProjects = projects.map((project) =>
      project.name === selectedProject?.name
        ? { ...project, statuses: [newStatus, ...project.statuses] }
        : project
    );

    setProjects(updatedProjects);

    // Update the statuses we're displaying (just 5 most recent).
    const updatedProject = updatedProjects.find(
      (p) => p.name === selectedProject?.name
    );
    setStatuses(updatedProject?.statuses.slice(0, 5) || []);

    toast({
      title: "Report Added",
      description: "Your status report has been successfully added.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-[1800px] mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          {/* Updated layout with 2-column structure */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">
                Status reports for the {selectedProject?.name}
              </h1>
              {/* dropdown with search using Headless UI Listbox */}
              <div className="w-full md:w-72">
                <Listbox value={selectedProject} onChange={handleProjectSelect}>
                  {({ open }) => (
                    <div className="relative mt-1">
                      <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
                        <span className="block truncate">
                          {selectedProject ? selectedProject.name : "Select a project"}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        </span>
                      </Listbox.Button>
                      <Listbox.Options className="absolute z-10 mt-1 max-h-96 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {/* Search input - fixed positioning and z-index */}
                        {/* <div className="sticky top-0 z-20 bg-white p-2 border-b shadow-sm"> */}
                        <div className="top-0 z-20 bg-white p-2 border-b shadow-sm">
                          <div className="relative">
                            <Search className="h-4 w-4 absolute left-2 top-2.5 text-gray-400" />
                            <input
                              type="text"
                              className="w-full py-2 pl-8 pr-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="Search projects..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>
                        
                        {/* List container with padding to prevent overlap */}
                        <div className="mt-1">
                          {/* Filtered project options */}
                          {filteredProjects.map((project) => (
                            <Listbox.Option
                              key={project.name}
                              value={project}
                              className={({ active }) =>
                                `relative cursor-default select-none py-2 pl-3 pr-9 ${
                                  active ? "bg-indigo-600 text-white" : "text-gray-900"
                                }`
                              }
                            >
                              {({ selected, active }) => (
                                <>
                                  <span
                                    className={`block truncate ${
                                      selected ? "font-semibold" : "font-normal"
                                    }`}
                                  >
                                    {project.name}
                                  </span>
                                  {selected && (
                                    <span
                                      className={`absolute inset-y-0 right-0 flex items-center pr-4 ${
                                        active ? "text-white" : "text-indigo-600"
                                      }`}
                                    >
                                      <Check className="h-5 w-5" aria-hidden="true" />
                                    </span>
                                  )}
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                          
                          {/* No results message */}
                          {filteredProjects.length === 0 && (
                            <div className="py-2 px-3 text-gray-500 text-sm">No matching projects</div>
                          )}
                        </div>
                      </Listbox.Options>
                    </div>
                  )}
                </Listbox>
              </div>
              <p className="mt-2 text-gray-600">
                Track and monitor project health over time
              </p>
              {selectedProjectLink && (
                <p className="text-sm text-gray-600 mt-2 flex items-center">
                  <span className="mr-2 text-gray-700 font-semibold">
                    Project Link:
                  </span>
                  <a
                    href={selectedProjectLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 transition duration-300 ease-in-out flex items-center space-x-2"
                  >
                    <span>{selectedProjectLink}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-box-arrow-up-right"
                      viewBox="0 0 16 16"
                    >
                      <path d="M10.854 4.646a.5.5 0 0 0 0-.708L7.707.707a.5.5 0 1 0-.708.708L9.793 4H2.5a.5.5 0 0 0 0 1h7.293l-2.793 2.793a.5.5 0 1 0 .708.708l3.5-3.5z" />
                    </svg>
                  </a>
                </p>
              )}
            </div>
            

          </div>

          {/* MetricsOverview receives the selected project's statuses */}
          <MetricsOverview
            projectName={selectedProject?.name || ""}
            statuses={statuses}
          />

          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Status History
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  View and manage status reports
                </p>
              </div>

              <AddReportButton onClick={() => setIsAddingReport(true)} />
            </div>

            

           

            <StatusTimeline statuses={statuses} />
          </div>

          <AddReportForm
            open={isAddingReport}
            onOpenChange={setIsAddingReport}
            onSubmit={handleAddReport}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
