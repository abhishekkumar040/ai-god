import React from 'react'
import AgentsWorkspace from '@/components/custom/agents/AgentsWorkspace'

function AgentsPage() {
    return (
        <div className='w-full flex justify-center'>
            <div className='w-full max-w-3xl px-6 pt-28 pb-16'>
                <AgentsWorkspace />
            </div>
        </div>
    )
}

export default AgentsPage
