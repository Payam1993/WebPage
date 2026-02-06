import {
  Card,
  CardContent,
  PageHeader,
  EmptyState,
  Icons,
} from '../../components/admin/ui'

/**
 * AssignedTask - Placeholder page for assigned task management
 * Coming soon feature
 */
const AssignedTask = () => {
  return (
    <div>
      <PageHeader 
        title="Assigned Task"
        subtitle="View and manage your assigned tasks"
      />

      <Card>
        <CardContent>
          <EmptyState
            icon={
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 11l3 3L22 4"/>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
              </svg>
            }
            title="Coming Soon"
            description="The Assigned Task feature is currently under development. Check back later for updates on task management and assignments."
          />
        </CardContent>
      </Card>

      <Card style={{ marginTop: '24px' }}>
        <CardContent>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1rem', fontWeight: 600, color: 'var(--ui-text)' }}>
            Planned Features
          </h3>
          <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--ui-text-muted)', lineHeight: 1.8 }}>
            <li>View tasks assigned to you</li>
            <li>Track task progress and status</li>
            <li>Set due dates and priorities</li>
            <li>Add notes and updates</li>
            <li>Mark tasks as complete</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

export default AssignedTask
