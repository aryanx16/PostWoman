import  { useState, useEffect } from "react";
import axios, { Method } from "axios"; // Import Method type
import logo from "../components/logo-removebg-preview.png"
import logo2 from "../components/image-removebg-preview.png"
// Define a more specific type for the response state
interface ResponseState {
    status?: number;
    headers?: any; // Axios headers can be complex, 'any' is simpler here
    data?: any;
    error: boolean;
    message?: string; // For error messages
    details?: string; // For more error details
}

const Home = () => {
    const [url, setUrl] = useState<string>("");
    const [method, setMethod] = useState<string>("GET");
    const [headers, setHeaders] = useState<{ key: string; value: string }[]>([]);
    const [body, setBody] = useState<string>("");
    // Use the more specific ResponseState type, initialized to null
    const [response, setResponse] = useState<ResponseState | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false); // Added loading state
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

    // Toggle dark mode
    const toggleDarkMode = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        localStorage.setItem('darkMode', JSON.stringify(newMode));
    };

    // Load dark mode preference from localStorage
    useEffect(() => {
        const savedMode = localStorage.getItem('darkMode');
        if (savedMode !== null) {
            setIsDarkMode(JSON.parse(savedMode));
        }
        // Apply dark class to body for potential global styles/modals if needed
        // document.body.classList.toggle('dark', isDarkMode);
    }, []); // Run only once on mount

    useEffect(() => {
         // Optional: Apply dark class to html or body element if you have global dark styles
         if (isDarkMode) {
            document.documentElement.classList.add('dark');
         } else {
            document.documentElement.classList.remove('dark');
         }
    }, [isDarkMode]); // Re-run when isDarkMode changes


    const addHeader = () => {
        setHeaders([...headers, { key: "", value: "" }]);
    };

    const removeHeader = (index: number) => {
        setHeaders(headers.filter((_, i) => i !== index));
    };

    const updateHeader = (index: number, field: "key" | "value", value: string) => {
        const newHeaders = [...headers];
        newHeaders[index][field] = value;
        setHeaders(newHeaders);
    };

    const handleSubmit = async () => {
        setResponse(null); // Clear previous response/error
        setIsLoading(true); // Set loading state

        // 1. Prepare headers object
        const requestHeaders: Record<string, string> = {};
        headers.forEach(header => {
            if (header.key.trim()) { // Only add if key is not empty or just whitespace
                requestHeaders[header.key.trim()] = header.value;
            }
        });

        // 2. Prepare body (attempt to parse JSON if needed)
        let requestData: any = undefined;
        const methodUpper = method.toUpperCase(); // Use uppercase for checks

        if (body.trim() && (methodUpper === 'POST' || methodUpper === 'PUT' || methodUpper === 'PATCH')) {
            try {
                requestData = JSON.parse(body);
            } catch (parseError) {
                setResponse({ // Display JSON parse error
                    error: true,
                    message: "Invalid JSON in request body.",
                    details: (parseError as Error).message
                });
                setIsLoading(false);
                return; // Stop the request
            }
        }

        // 3. Make the request using axios config object
        try {
            console.log("Sending request:", {
                method: method.toLowerCase(),
                url: url,
                headers: requestHeaders,
                data: requestData,
            });

            const res = await axios({
                method: method.toLowerCase() as Method, // Use imported Method type
                url: url,
                headers: requestHeaders,
                data: requestData,
                // Optional: Add timeout
                // timeout: 10000, // 10 seconds
            });

            console.log("Received response:", res);
            setResponse({ // Store relevant parts of the successful response
                status: res.status,
                headers: res.headers,
                data: res.data,
                error: false // Explicitly mark as not an error
            });

        } catch (err: any) {
            console.error("Request failed:", err);
            // Handle different types of errors (network error, HTTP error)
            if (err.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                setResponse({
                    error: true,
                    status: err.response.status,
                    headers: err.response.headers,
                    data: err.response.data, // Error response body from server
                    message: `Request failed with status code ${err.response.status}`
                });
            } else if (err.request) {
                // The request was made but no response was received (network error, CORS)
                setResponse({
                    error: true,
                    message: "No response received from server.",
                    details: "Check network connection, CORS policy on the server, or the URL.",
                    // requestDetails: err.request // Can be large/complex
                });
            } else {
                // Something happened in setting up the request that triggered an Error
                setResponse({
                    error: true,
                    message: "Error setting up the request.",
                    details: err.message
                });
            }
        } finally {
            setIsLoading(false); // Turn off loading indicator
        }
    };

    return (
        // Apply dark mode classes to the root element
        <div className={`${isDarkMode ? 'dark bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'} min-h-screen transition-colors duration-300`}>
            {/* Navbar */}
            <nav className={`
                ${isDarkMode
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-white border-gray-200 shadow-sm'
                } border-b px-4 py-3 flex justify-between items-center sticky top-0 z-10`}
            >
                <div className="flex items-center">
                    {/* You can add an icon here */}
                   
                    <h1 className="text-xl font-bold">{!isDarkMode? <img className="w-20" src={logo} alt="" />:<img className="w-20" src={logo2} alt="" />}</h1>
                </div>
                <div>
                    <button
                        onClick={toggleDarkMode}
                        className={`
                            ${isDarkMode
                                ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' // Use yellow for sun
                                : 'bg-gray-200 hover:bg-gray-300 text-neutral-600' // Use indigo for moon
                            } px-4 py-2 rounded-md transition-colors duration-200 flex items-center text-sm font-medium`}
                    >
                         {isDarkMode
                             ? <><span role="img" aria-label="Sun" className="mr-2">☀️</span> Light Mode</>
                             : <><span role="img" aria-label="Moon" className="mr-2">🌙</span> Dark Mode</>
                         }
                    </button>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className={`
                    ${isDarkMode
                        ? 'bg-gray-800 border border-gray-700'
                        : 'bg-white border border-gray-200'
                    } shadow-lg rounded-lg p-6 `}
                >
                    {/* URL and Method Container */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6"> {/* Adjusted gap and mb */}
                        {/* URL Input */}
                        <div className="flex-grow">
                            <label htmlFor="url-input" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                URL
                            </label>
                            <input
                                id="url-input"
                                type="url" // Use type="url" for better semantics/validation
                                placeholder="Enter request URL (e.g., https://api.example.com/data)"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className={`
                                    w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50
                                    ${isDarkMode
                                        ? 'bg-gray-700 border border-gray-600 text-gray-100 focus:ring-blue-500 focus:border-blue-500'
                                        : 'border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500'
                                    }`}
                            />
                        </div>

                        {/* Method Selector */}
                        <div className="w-full sm:w-auto"> {/* Control width */}
                            <label htmlFor="method-select" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                Method
                            </label>
                            <select
                                id="method-select"
                                value={method}
                                onChange={(e) => setMethod(e.target.value)}
                                className={`
                                    w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 appearance-none pr-8 bg-no-repeat bg-right
                                    ${isDarkMode
                                        ? 'bg-gray-700 border border-gray-600 text-gray-100 focus:ring-blue-500 focus:border-blue-500 bg-[url(\'data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"><path stroke="%239ca3af" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 8l4 4 4-4"/></svg>\')]' // Dark mode arrow
                                        : 'border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 bg-[url(\'data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"><path stroke="%236b7280" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 8l4 4 4-4"/></svg>\')]' // Light mode arrow
                                    }`}
                            >
                                {["GET", "POST", "PUT", "DELETE"].map((m) => ( // Added OPTIONS, HEAD
                                    <option key={m} value={m} className={isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}>
                                        {m}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Tabs for Headers/Body? (Optional Enhancement) */}
                    {/* Or just keep sections */}

                    {/* Headers Section */}
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                                Headers ({headers.length})
                            </h3>
                            <button
                                onClick={addHeader}
                                className={`
                                    ${isDarkMode
                                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                        : 'bg-blue-500 text-white hover:bg-blue-600'
                                    } px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 flex items-center`}
                            >
                               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                               </svg>
                                Add
                            </button>
                        </div>
                        {headers.length > 0 && (
                             <div className="space-y-2">
                                {headers.map((header, index) => (
                                    <div key={index} className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 items-start sm:items-center">
                                        <input
                                            type="text"
                                            placeholder="Key"
                                            aria-label="Header key"
                                            value={header.key}
                                            onChange={(e) => updateHeader(index, "key", e.target.value)}
                                            className={`
                                                flex-1 w-full sm:w-auto px-2 py-1 rounded-md focus:outline-none focus:ring-1
                                                ${isDarkMode
                                                    ? 'bg-gray-700 border border-gray-600 text-gray-100 focus:ring-blue-500 focus:border-blue-500'
                                                    : 'border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500'
                                                } text-sm`}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Value"
                                            aria-label="Header value"
                                            value={header.value}
                                            onChange={(e) => updateHeader(index, "value", e.target.value)}
                                            className={`
                                                flex-1 w-full sm:w-auto px-2 py-1 rounded-md focus:outline-none focus:ring-1
                                                ${isDarkMode
                                                    ? 'bg-gray-700 border border-gray-600 text-gray-100 focus:ring-blue-500 focus:border-blue-500'
                                                    : 'border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500'
                                                } text-sm`}
                                        />
                                        <button
                                            onClick={() => removeHeader(index)}
                                            title="Remove Header"
                                            className={`
                                                ${isDarkMode
                                                    ? 'bg-red-600 hover:bg-red-700 text-white'
                                                    : 'bg-red-500 text-white hover:bg-red-600'
                                                } px-2 py-1 rounded-md transition-colors duration-200 self-end sm:self-center`} // Align button
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                         )}
                        {headers.length === 0 && (
                           <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>No headers added.</p>
                        )}
                    </div>

                    {/* Body Section */}
                    <div className="mb-6">
                        <label htmlFor="body-textarea" className={`block text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} mb-2`}>
                            Request Body (JSON)
                        </label>
                        <textarea
                            id="body-textarea"
                            placeholder='Enter JSON body (e.g., { "key": "value" })'
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                             disabled={method === 'GET' || method === 'DELETE' || method === 'HEAD'} // Disable for methods that typically don't use bodies
                            className={`
                                w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 min-h-[120px] font-mono text-sm // Use mono font
                                ${isDarkMode
                                    ? 'bg-gray-700 border border-gray-600 text-gray-100 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50'
                                    : 'border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50'
                                }`}
                        />
                    </div>

                    {/* Send Request Button */}
                    <div className="mb-8 text-center"> {/* Increased margin */}
                        <button
                            onClick={handleSubmit}
                            disabled={!url || isLoading} // Disable if no URL or loading
                            className={`
                                ${isDarkMode
                                    ? 'bg-green-600 hover:bg-green-700 text-white disabled:bg-green-800'
                                    : 'bg-green-500 hover:bg-green-600 text-white disabled:bg-green-300'
                                } px-8 py-2.5 rounded-md transition-all duration-200 text-lg font-medium shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                                ${isDarkMode ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'}
                                disabled:cursor-not-allowed disabled:opacity-70 inline-flex items-center`}
                        >
                             {isLoading ? (
                                <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Sending...
                                </>
                             ) : (
                                <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                                </svg>
                                Send Request
                                </>
                            )}
                        </button>
                    </div>

                    {/* Response Section */}
                    <div className={`
                        ${isDarkMode ? 'bg-gray-850 border-gray-700' : 'bg-gray-50'} // Slightly different bg for distinction
                        rounded-lg p-4 border min-h-[200px]`} // Set min height
                    >
                        <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                            Response
                        </h3>
                         {isLoading && ( // Show loading indicator here too
                            <div className={`flex justify-center items-center h-full ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                <svg className="animate-spin h-8 w-8 " xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span className="ml-3">Loading response...</span>
                             </div>
                         )}
                        {!isLoading && response ? ( // Only show response/error if not loading
                            <div>
                                {response.error ? (
                                    // Error Display
                                    <div className={`border-l-4 p-4 rounded-r-md ${isDarkMode ? 'border-red-500 bg-red-900 bg-opacity-30 text-red-300' : 'border-red-400 bg-red-100 text-red-700'}`} role="alert">
                                        <p className="font-bold mb-1">Error: {response.message || 'Request Failed'}</p>
                                        {response.status && (
                                             <p className="text-sm"><strong>Status:</strong> {response.status}</p>
                                        )}
                                        {response.details && (
                                             <p className="text-sm mt-1"><strong>Details:</strong> {response.details}</p>
                                        )}
                                         {response.data && ( // Show error data if available
                                            <>
                                                <h5 className={`font-semibold mt-3 mb-1 text-sm ${isDarkMode ? 'text-red-400': 'text-red-600'}`}>Error Data:</h5>
                                                 <pre className={` p-2 rounded text-xs overflow-x-auto ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-red-50 text-red-900'}`}>
                                                    {JSON.stringify(response.data, null, 2)}
                                                 </pre>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    // Success Display
                                    <div className="space-y-4">
                                        {/* Status */}
                                        <div>
                                            <span className={`font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                Status:
                                            </span>
                                            <span
                                                className={`ml-2 px-2 py-0.5 rounded-full text-sm font-bold ${
                                                    response.status && response.status >= 200 && response.status < 300
                                                        ? (isDarkMode ? "bg-green-800 text-green-300" : "bg-green-100 text-green-700")
                                                        : (isDarkMode ? "bg-yellow-800 text-yellow-300" : "bg-yellow-100 text-yellow-700") // Use yellow for non-2xx
                                                }`}
                                            >
                                                {response.status || 'N/A'}
                                            </span>
                                        </div>

                                        {/* Headers */}
                                        <div>
                                            <h4 className={`font-semibold mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                Response Headers:
                                            </h4>
                                            <pre
                                                className={`
                                                    ${isDarkMode
                                                        ? 'bg-gray-700 border-gray-600 text-gray-100'
                                                        : 'bg-white border-gray-200 text-gray-800'
                                                    } border p-3 rounded-md overflow-x-auto text-xs font-mono`} // Smaller text, mono
                                            >
                                                {JSON.stringify(response.headers, null, 2)}
                                            </pre>
                                        </div>

                                        {/* Body */}
                                        <div>
                                            <h4 className={`font-semibold mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                Response Body:
                                            </h4>
                                            <pre
                                                className={`
                                                    ${isDarkMode
                                                        ? 'bg-gray-700 border-gray-600 text-gray-100'
                                                        : 'bg-white border-gray-200 text-gray-800'
                                                    } border p-3 rounded-md overflow-x-auto text-xs font-mono`} // Smaller text, mono
                                            >
                                                {/* Attempt to pretty-print if data is object/array, otherwise show as is */}
                                                {typeof response.data === 'object' ? JSON.stringify(response.data, null, 2) : String(response.data)}
                                            </pre>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                             // Only show "Send request" message if not loading and no response yet
                             !isLoading && <p className={`text-center italic ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                No response to display. Configure and send a request!
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;