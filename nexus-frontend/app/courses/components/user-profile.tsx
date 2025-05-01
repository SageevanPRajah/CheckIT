interface UserProfileProps {
    username: string
}

export default function UserProfile({ username }: UserProfileProps) {
    // Get the first letter of the username for the avatar
    const initial = username.charAt(0).toUpperCase()

    return (
        <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-cyan-500 flex items-center justify-center text-white font-medium">
                {initial}
            </div>
            <span className="text-gray-700 font-medium">{username}</span>
        </div>
    )
}

