import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LucideIcon } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Conditional from "../Conditional"

export type TDescriptor = {
  title: string,
  icon: LucideIcon,
}

export type TInterviewSuggestionCard = {
  title: string,
  subTitle: string,
  difficulty?: string,
  descriptors?: TDescriptor[],
  icon?: LucideIcon,
  textLogo?: string,
  link: string,
}

export type TInterviewSuggestionCardProps = {
  data: TInterviewSuggestionCard[],
  sectionTitle: string,
}

const DifficultyBadge = ({ difficulty }: { difficulty?: string }) => {
  if (!difficulty) return null
  
  const colors = {
    Easy: 'bg-green-100 text-green-700',
    Medium: 'bg-yellow-100 text-yellow-700',
    Intermediate: 'bg-blue-100 text-blue-700',
    Hard: 'bg-red-100 text-red-700',
    Advanced: 'bg-purple-100 text-purple-700',
  }
  
  return (
    <div className={`inline-block px-2 py-1 rounded-full text-sm ${colors[difficulty as keyof typeof colors]}`}>
      {difficulty}
    </div>
  )
}

export function SuggestedInterviews({data, sectionTitle}: TInterviewSuggestionCardProps) {
  return (
    <div className="flex flex-col space-y-6 mt-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{sectionTitle}</h2>
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {Object.values(data)?.map((interview, index) => (
            <CarouselItem key={index} className="pl-4 basis-full md:basis-1/3">
              <Card className="p-6">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      {interview.icon && <interview.icon className="w-6 h-6 text-blue-600" />}
                      <Conditional if = {!interview.icon && !!interview.textLogo}>
                        {interview.textLogo}
                      </Conditional>
                    </div>
                    <div>
                      <h3 className="font-medium text-base">{interview.title}</h3>
                      <p className="text-sm text-gray-500">{interview.subTitle}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-2">
                    <Conditional if = {!!interview.difficulty}>
                      <DifficultyBadge difficulty={interview.difficulty} />
                    </Conditional>
                    <Conditional if = {!!interview?.descriptors}>
                      {Object.values(interview?.descriptors || {}).map((descriptor) => (
                        <div className="flex items-center text-sm text-gray-600">
                          <descriptor.icon className="w-4 h-4 mr-1" />
                          {descriptor.title}
                        </div>
                      ))}
                    </Conditional>
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