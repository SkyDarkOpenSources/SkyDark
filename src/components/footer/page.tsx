

export default function Footer(){
    return(
        <footer className="w-full h-auto bg-slate-600">
            <div className="grid grid-flow-row grid-rows-2">
                <div className="flex flex-rows justify-between pt-10 pl-10 pr-10 lg:flex-rows md:flex-rows">
                    <div className="grid grid-flow-row grid-rows gap-3">
                        <a href="" className="hover:underline">Home</a>
                        <a href="" className="hover:underline">About</a>
                        <a href="" className="hover:underline">Contact</a>
                    </div>
                    <div className="grid grid-flow-row grid-rows gap-3">
                        <a href="" className="hover:underline">Events</a>
                        <a href="" className="hover:underline">Drones</a>
                        <a href="" className="hover:underline">Space-tech</a>
                    </div>
                    <div className="grid grid-flow-row grid-rows gap-3">
                        <a href="" className="hover:underline">Terms & condition</a>
                        <a href="" className="hover:underline">Privacy Policy</a>
                        <a href="" className="hover:underline">SkyDark</a>
                    </div>
                    <div className="grid grid-flow-row grid-rows gap-3">
                        <a href="" className="hover:underline">Founders</a>
                        <a href="" className="hover:underline">Story</a>
                        <a href="" className="hover:underline">Future-Plans</a>
                    </div>
                </div>
                <div className="flex flex-rows-2 justify-between pt-10 pr-10 pl-10">
                    <div className="">
                        &copy; 2025 SkyDark. All rights reserved.
                    </div>
                    <div className="">
                        Made with Team SkyDark
                    </div>
                </div>
            </div>
        </footer>
    );
}