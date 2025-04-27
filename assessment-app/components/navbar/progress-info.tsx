"use client"

import * as React from "react"
import { SidebarTrigger } from "../ui/sidebar"

export function ProgressInfo() {
  return (
    <section className="flex items-center justify-center">
      <div className="flex flex-row items-center justify-center space-x-2">
        <SidebarTrigger />
        <div className="flex justify-center flex-col">
          <h4 className="text-center font-semibold">Progress</h4>
        </div>
      </div>
    </section>
  )
}
