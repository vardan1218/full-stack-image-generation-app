import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


const Loader = () => {
  return <div className="flex justify-center">Loading...</div>
}

export const Landing = () => {
  const [images, setImages] = useState<string[]>([])
  const [value, setValue] = useState("")
  const [numImages, setNumImages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedModel, setSelectedModel] = useState("dall-e-2")
  const [hdQuality, setHdQuality] = useState("standard")
  const [handleSizechange, setHandleSizeChange] = useState<string>("")
  const navigate = useNavigate()
  
  const getImages = async (evt: React.MouseEvent<HTMLButtonElement>) => {
      evt.preventDefault()
      if (!value.trim()) {
        setError("Prompt cannot be empty");
        setTimeout(() => setError(""), 3000)
        return;
      }
  
      try {
        setLoading(true)
        setValue("")
        setImages([])
      
        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("token not found in the localstorage")
        }
        const response = await axios.post('http://localhost:3000/Dalle',
        { message: value, numImages: numImages, model: selectedModel, quality: hdQuality, sizes: handleSizechange },
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        }
        )
        console.log(response.data)
        setImages(response.data.imageUrls)
        setError("")

      } catch (error) {
        console.log("Error: ", error)
        setLoading(false)
        setError("Error occured while fetching images")
      }
  }


  useEffect(() => {
    if (images.length > 0) {
      setLoading(false)
    }
  }, [images])

  let imageContainerClassName = "w-full flex flex-wrap items-stretch justify-center";
  if (images.length === 1) {
    imageContainerClassName = "w-full flex items-center justify-center";
  }

  const numImagesOptions = selectedModel === "dall-e-2" ? [1, 2, 3, 4, 5] : [1];

  const sizesForModel = selectedModel === "dall-e-2" ? ["256x256", "512x512", "1024x1024"] : ["1024x1024", "1792x1024", "1024x1792"]

  const Logout = () => {
    console.log("I have been called") 
    localStorage.removeItem("token");
    navigate("/signup", { replace: true })
  }

  return (
    <div className="flex flex-col items-center bg-black min-h-screen">
      {error && <div className="text-red-500 flex justify-center">{error}</div>}
      <button className="absolute top-4 right-4 text-white bg-blue-700 hover:bg-blue-800 py-2 px-4 rounded-lg" onClick={Logout}>Logout</button>
      <div className="mt-auto mb-6">
        <div className={imageContainerClassName}>
          {images.map((imageUrl, index) => (
            <div key={index} className="w-full sm:w-1/2 md:w-1/3 m-1">
              <img
                src={imageUrl}
                alt={`Generated image ${index + 1}`}
                className="min-w-64 w-full grow"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="text-red-200 text-2xl font-bold mb-4">
        Give me a prompt and generate images
      </div>
      <form className="w-3/4 mb-3">
        <div className="flex items-center justify-center">
          
        <select
            value={handleSizechange}
            onChange={(e) => setHandleSizeChange(e.target.value)}
            className="text-gray-900 bg-red-800 border border-gray-300 rounded-lg p-4 mr-6 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="">Size</option>
            {sizesForModel.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>

          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            type="search"
            className="h-auto w-full p-4 appearance-none text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter a prompt..."
          />
          <select
            value={selectedModel}
            onChange={(e) => {
              setSelectedModel(e.target.value);
              if(e.target.value === "dall-e-2") {
                setHdQuality("standard")
              }
            }}
            className="text-gray-900 bg-red-800 border border-gray-300 rounded-lg p-4 ml-2 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
          <option value="dall-e-2">dall-e-2</option>
          <option value="dall-e-3">dall-e-3</option>
          </select>

            {selectedModel === "dall-e-3" && (
              <label className='rounded-lg p-4 flex ml-2 justify-center text-white bg-gray-700'>
                <input
                  type="checkbox"
                  checked={hdQuality === "hd"}
                  onChange={(e) => setHdQuality(e.target.checked ? "hd" : "standard")}
                  />
                  HD
              </label>     
            )}

          <select
            value={numImages}
            onChange={(e) => setNumImages(parseInt(e.target.value))}
            className="text-gray-900 bg-red-800 border border-gray-300 rounded-lg p-4 ml-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="">Images</option>
            {numImagesOptions.map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>

          <button
            onClick={getImages}
            className="text-white ml-2 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-4 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            {loading ? <Loader /> : "Search"}
          </button>
        </div>
      </form>
    </div>
  );
};