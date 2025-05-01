'use client'

import ProcessForm from './components/ProcessForm'
import ProcessFeed from './components/ProcessFeed'

export default function ProcessPage() {
  return (
    <div className="max-w-xl mx-auto py-6">
      <ProcessForm />
      <ProcessFeed />
    </div>
  )
}
