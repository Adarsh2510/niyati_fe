import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Code, Layout, TreePine } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

//TODO: Replace this with actual suggested interviews once API is implemented
const suggestedInterviews = [
  {
    title: "Frontend Developer Interview",
    company: "Tech Corp",
    difficulty: "Intermediate",
    duration: "60 mins",
    icon: Code,
  },
  {
    title: "System Design Interview",
    company: "StartUp Inc",
    difficulty: "Advanced",
    duration: "45 mins",
    icon: Layout,
  },
  {
    title: "Data Structures & Algorithms",
    company: "Tech Giants",
    difficulty: "Advanced",
    duration: "90 mins",
    icon: TreePine,
  },
  {
    title: "Data Structures & Algorithms",
    company: "Tech Giants",
    difficulty: "Advanced",
    duration: "90 mins",
    icon: TreePine,
  }
]

export function SuggestedInterviews() {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Recommended Mock Interviews</h2>
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {suggestedInterviews.map((interview, index) => (
            <CarouselItem key={index} className="pl-4 basis-full md:basis-1/3">
              <Card className="p-6">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <interview.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-base">{interview.title}</h3>
                      <p className="text-sm text-gray-500">{interview.company}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-1">⭐</span>
                      {interview.difficulty}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-1" />
                      {interview.duration}
                    </div>
                  </div>

                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Start Practice
                  </Button>
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </div>
  )
} 