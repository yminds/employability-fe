import { parse } from "node-html-parser"

export function parseKeyResponsibilities(description: string): string[] {
  console.log("Raw description:", description)
  const root = parse(description)

  // Look for various possible headers
  const possibleHeaders = [
    "Roles and Responsibilities:",
    "Responsibilities:",
    "Key Responsibilities:",
    "Job Responsibilities:",
  ]

  let responsibilitiesSection = null
  for (const header of possibleHeaders) {
    responsibilitiesSection = root.querySelector(`div:contains("${header}")`)
    if (responsibilitiesSection) {
      console.log(`Found section with header: ${header}`)
      break
    }
  }

  if (responsibilitiesSection) {
    const listItems = responsibilitiesSection.querySelectorAll("li")
    console.log("Number of list items found:", listItems.length)
    return listItems.map((item) => item.textContent.trim())
  } else {
    console.log("No responsibilities section found")
    // If no specific section is found, try to extract all list items
    const allListItems = root.querySelectorAll("li")
    console.log("Total number of list items in document:", allListItems.length)
    return allListItems.map((item) => item.textContent.trim())
  }
}

