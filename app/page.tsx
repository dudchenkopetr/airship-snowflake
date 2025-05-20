import SnowflakeConnectionManager from "@/components/snowflake-connection-manager"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-2 md:px-4 py-4">
        <h1 className="mb-1 text-2xl font-bold text-gray-900">Snowflake Connections</h1>
        <p className="mb-4 text-sm text-gray-600">Manage your Snowflake connections for Airship</p>

        <div className="mt-4">
          <SnowflakeConnectionManager />
        </div>
      </div>
    </main>
  )
}
