

export default function Footer() {
    return(
        <footer className="items-center flex flex-col lg:flex-row md:flex-row justify-between p-4 margin-0">
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