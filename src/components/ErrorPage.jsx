export default function ErrorPage({ code, message, image }) {
    return (
        <div className="flex flex-col items-center justify-center h-[70vh] text-center">

            <img src={image} alt="error" className="w-80 mb-6" />

            <h1 className="text-5xl font-bold text-gray-800">
                {code}
            </h1>

            <p className="text-gray-500 mt-2">
                {message}
            </p>
        </div>
    );
}