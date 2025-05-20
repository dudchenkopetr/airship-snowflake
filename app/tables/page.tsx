import SnowflakeTableManager from "@/components/snowflake-table-manager"
import Navigation from "@/components/navigation"

export default function TablesPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-2 md:px-4 py-4">
        <h1 className="mb-1 text-2xl font-bold text-gray-900">Snowflake Tables</h1>
        <p className="mb-4 text-sm text-gray-600">Manage your Snowflake tables for Airship</p>

        <Navigation />

        <div className="mt-4">
          <SnowflakeTableManager />
        </div>
      </div>
    </main>
  )
}
