"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ReportPage() {
  return (
    <div className={"absolute inset-0 grid place-content-center"}>
      <div className={"p-4 border border-border rounded-xl max-w-sm text-center"}>
        <div>
          <h1 className={"text-foreground font-medium text-lg"}>
            Interview Complete
          </h1>
          <p className={"text-muted-foreground text-sm mt-2"}>
            This is a placeholder for your interview report.
          </p>
        </div>
        <div className={"pt-4"}>
          <Button className={"rounded-full w-full"} asChild>
            <Link href={"/"}>
              Start New Interview
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}