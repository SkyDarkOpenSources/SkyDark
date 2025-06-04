

export default function Footer() {
    return(
        <footer className="items-center flex flex-col lg:flex-row md:flex-row justify-between p-4 border-t border-gray-700 bg-gray-900 text-white">
            <div>
                <p className="text-gray-400 text-sm">
                    © {new Date().getFullYear()} SkyDark. All rights reserved.
                </p>
            </div>
            <div>
                <p className="text-gray-400 text-sm">
                    Made by Team SkyDark
                </p>
            </div>
        </footer>
    );
}