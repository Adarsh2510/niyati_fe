export default function Footer() {
    return (
        <div className="bg-white py-4">
            <div className="container mx-auto px-4">
                <p className="text-center text-gray-600">
                    &copy; {new Date().getFullYear()} Niyati. All rights reserved.
                </p>
            </div>
        </div>
    )
}