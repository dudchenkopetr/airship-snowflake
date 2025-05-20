import Image from "next/image"
import Link from "next/link"

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-2 md:px-4">
        <div className="flex h-12">
          <Link href="/" className="flex items-center">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Airship-logo-navigation%202-9MqbGQNeU41gHtohc3lyNW7xjxhQxQ.png"
              alt="Airship Logo"
              width={28}
              height={28}
            />
          </Link>
        </div>
      </div>
    </header>
  )
}
