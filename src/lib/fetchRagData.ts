// src/lib/fetchRagData.ts

export interface Status {
  date: string;
  status: "Green" | "Amber" | "Red";
  reporter: string;
  comment: string;
}

export interface Project {
  name: string;
  link: string;
  statuses: Status[];
}

export async function fetchProjectsList(): Promise<Project[]> {
  try {
    const response = await fetch("./src/pages/grouped_output2.json");
    const data: {
      [key: string]: {
        Date: string;
        "RAG Status": string;
        "Status Context": string;
        Author?: string;
      }[];
    } = await response.json();

    // Convert the JSON to an array of project objects
    const projectsList: Project[] = Object.entries(data).map(([rawName, statuses]) => {
      const nameParts = rawName.split(" (");
      const projectName = nameParts[0];
      const projectLink = nameParts[1]?.replace(")", "") || "";

      return {
        name: projectName,
        link: projectLink,
        statuses: statuses.map((s) => ({
          date: s.Date,
          status: s["RAG Status"] as "Green" | "Amber" | "Red",
          reporter: s.Author ?? "Unknown Reporter",
          comment: s["Status Context"],
        })),
      };
    });

    return projectsList;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
