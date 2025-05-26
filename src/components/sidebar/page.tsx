

export default function Sidebar(){
    return(
        <div className="w-auto h-screen bg-slate-600 blur-md justify-self-end p-10 pr-40">
            <div className="grid grid-flow-row grid-rows-3 gap-7 text-lg">
                <div>
                    <a href="">Home</a>
                </div>
                <div>
                    <a href="">About</a>
                </div>
                <div>
                    <a href="">Contact</a>
                </div>
            </div>
        </div>
    );
}