import type React from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Laptop, Code2 } from "lucide-react"
import SkillSelector from "../../SkillSelector"

interface Skill {
  _id: string
  name: string
  icon?: string
}

interface ProjectSkillsStepProps {
  selectedSkills: Skill[]
  setSelectedSkills: React.Dispatch<React.SetStateAction<Skill[]>>
}

const ProjectSkillsStep: React.FC<ProjectSkillsStepProps> = ({ selectedSkills, setSelectedSkills }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-bold text-primary"
      >
        Let's showcase your tech prowess!
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-muted-foreground"
      >
        Select the technologies and skills you've used in this project. This will help others understand your expertise
        and the project's tech stack.
      </motion.p>

      <Card className="p-6">
        <SkillSelector
          selectedSkills={selectedSkills}
          setSelectedSkills={setSelectedSkills}
          label="Pick Your Project's Tech Stack"
          placeholder="Search for technologies..."
        />
      </Card>
    </motion.div>
  )
}

export default ProjectSkillsStep

