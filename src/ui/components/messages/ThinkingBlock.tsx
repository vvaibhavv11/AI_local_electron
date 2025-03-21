export const ThinkingBlock = () => {
    return (
        <div className="flex justify-start mb-4">
            <div className="bg-[#2A1515] text-[#D4A6A6] rounded-2xl rounded-tl-none px-6 py-4 max-w-[80%]">
                <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-[#D4A6A6] rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-[#D4A6A6] rounded-full animate-pulse delay-150"></div>
                    <div className="w-2 h-2 bg-[#D4A6A6] rounded-full animate-pulse delay-300"></div>
                </div>
            </div>
        </div>
    );
}; 