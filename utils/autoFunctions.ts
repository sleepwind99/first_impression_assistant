import { Report } from "@/models/report";

export async function runFunction(name: string, args: any) {
  switch (name) {
    case "sendReport":
      return await sendReport(args);
  }
  return "error";
}

const sendReport = async ({ report }: { report: Report }): Promise<string> => {
  console.log(report);
  try {
    await fetch("http://localhost:3000/api/sendmail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ report }),
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return "error";
  }
  return "success";
};
