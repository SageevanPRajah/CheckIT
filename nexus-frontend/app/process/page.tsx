'use client'

import ProcessForm from './components/ProcessForm'
import ProcessFeed from './components/ProcessFeed'
import ProcessCount from './components/ProcessCount'

export default function ProcessPage() {
  return (
    <div className="max-w-xl mx-auto py-6">
      <ProcessForm />
      <ProcessCount />
      <ProcessFeed />
    </div>
  )
}
