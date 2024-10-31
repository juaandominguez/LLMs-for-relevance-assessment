import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Topic as TopicType } from '@/types'

interface TopicProps {
  topic: TopicType
}

const Topic: React.FC<TopicProps> = ({ topic }) => {
  return (
    <Card className="w-[80%] max-w-[800px]">
      <CardHeader>
        <CardTitle>{topic.title}</CardTitle>
        <CardDescription>{topic.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='text-lg space-y-6'>
          {topic.narrative}
        </div>
      </CardContent>
    </Card>
  )
}

export default Topic