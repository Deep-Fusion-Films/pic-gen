import { useState } from "react";
import Button from "../components/Button";
import ServerSettings from "./ServerSettings";

export default function Dashboard() {
  const [showDropDown, setShowDropDown] = useState(false);
  const [showServerSettings, setShowServerSettings] = useState(false);
  const [prompt, setPrompt] = useState("");

  //   handle drop down menu
  const handleDropDown = () => {
    setShowDropDown(!showDropDown);
  };

  //handle open file manager
  const handOpenFile = async () => {
    // let file = e.target.files[0];
    // if (!file) return;

    // if (file.type !== "application/json" && !file.name.endsWith(".json")) {
    //   alert("Please upload a valid JSON file");
    //   return;
    // }

    if (!prompt.trim()) {
      alert("Please enter a prompt");
      return;
    }

    try {
      // const formData = new FormData();

      // formData.append("file", file);

      const response = await fetch(
        `${import.meta.env.VITE_URL}/upload/workflow/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: prompt }),
          // formData,
        }
      );

      if (!response.ok) {
        console.log("something went wrong");
        alert("An error occured, please try again later")
        return;
      }

      const data = await response.json();
      console.log("Runpod result", data);
      localStorage.setItem("prompt_id", data.prompt_id);
      startPolling(data.prompt_id);
    } catch (err) {
      alert("Encountered an error with the server, please try again later")
      console.log("Error Uploading workflow", err);
    }
  };

  //poll to get the results
  const startPolling = (id?: string) => {
    const prompt_id = id || localStorage.getItem("prompt_id");
    if (!prompt_id) {
        alert("No prompt ID detected")
        return
    };

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_URL}/upload/result/?prompt_id=${prompt_id}`
        );
        const data = await res.json();

        if (!res.ok) {
          console.log(data.error);
          clearInterval(interval);
          localStorage.removeItem("prompt_id");
          alert("Could not fetch the prompt in history")
        }

        console.log("this is the data:", data);

        const promptData = data[prompt_id];
        if (promptData && promptData.outputs) {
          const node = Object.keys(promptData.outputs)[0];
          const images = promptData.outputs[node].images;

          if (images && images.length > 0) {
            const filename = images[0].filename;
            console.log("Extracted filename:", filename);

            localStorage.setItem("filename", filename);

            // Fetch the actual image from the backend
            const backendRes = await fetch(
              `${import.meta.env.VITE_URL}/upload/view/?filename=${filename}`
            );
            if (!backendRes.ok) {
              console.error("Error fetching image from backend");
              clearInterval(interval);
              localStorage.removeItem("prompt_id");
              alert("Error fetching image from server, please try again later")
              return;
            }

            const blob = await backendRes.blob(); // get image as blob
            const imgURL = URL.createObjectURL(blob);
            console.log("Image URL:", imgURL);

            // Optional: set to an <img> element
            const imgElement = document.getElementById(
              "myImg"
            ) as HTMLImageElement | null;
            if (imgElement) imgElement.src = imgURL;

            clearInterval(interval);
            localStorage.removeItem("prompt_id");
            localStorage.removeItem("filename");
          }
        }
      } catch (err) {
        console.error("Polling error:", err);
        clearInterval(interval); // stop on error if you want
        localStorage.removeItem("prompt_id");
        localStorage.removeItem("filename");
        alert("Encountered an Error fetching Image from the server, please try again later")
      }
    }, 3000); // poll every 3 seconds
  };

  const saveImage = () => {
    const imgElement = document.getElementById(
      "myImg"
    ) as HTMLImageElement | null;
    if (!imgElement || !imgElement.src) {
      alert("No image to save!");
      return;
    }

    const link = document.createElement("a");
    link.href = imgElement.src;
    link.download = "generated_image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShowServerSettings = () => {
    setShowServerSettings(!showServerSettings);
    setShowDropDown(!showDropDown);
  };

  return (
    <>
      {/* Header */}
      <section>
        <div className="flex p-4 shadow-lg items-center justify-center bg-blue-900">
          <h1 className="text-white font-bold">Pic-Gen</h1>
          {/* <label
            htmlFor="file"
            className="hover:cursor-pointer text-center shadow-lg rounded-md w-40 active:shadow-sm p-1 bg-gray-500 text-white"
          >
            Load Workflow
          </label>
          <input
            onChange={handOpenFile}
            id="file"
            type="file"
            className="hidden"
          />

          <Button
            pd={"p-1"}
            bg={"bg-green-500"}
            color={"text-white"}
            text={"Start"}
          />

          <Button
            pd={"p-1"}
            bg={"bg-red-500"}
            color={"text-white"}
            text={"Stop"}
          />
          <div className="relative">
            <button
              onClick={handleDropDown}
              className="hover:cursor-pointer p-1 bg-gray-500 text-white shadow-lg rounded-md w-40 active:shadow-sm "
            >
              settings
            </button>
            {showDropDown && (
              <button
                onClick={handleShowServerSettings}
                className="hover:cursor-pointer bg-red-500 absolute left-0 top-8 p-1 bg-white text-gray-500 shadow-lg rounded-md w-40 active:shadow-sm"
              >
                Server Settings
              </button>
            )}
          </div> */}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-center mt-10">
          <div className="border p-2 rounded-lg bg-blue-100">
            <div className=" rounded-lg">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Type your prompt here.."
                className="w-100 h-20 p-1 bg-white"
                name="text"
                id=""
              ></textarea>
            </div>
            <button
              onClick={handOpenFile}
              className="rounded-lg w-100 border w-40 bg-blue-900 border-blue-900 text-white shadow-lg active:shadow-sm"
            >
              Generate Image
            </button>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-center justify-center">
            <div className=" p-2 border bg-blue-100 rounded-lg flex items-center justify-center text-center h-100 w-100">
              <img id="myImg" className="rounded-lg" src="" alt="" />
            </div>
        </div>
        <div className="flex justify-center">
          
            <div
              onClick={saveImage}
              className=" bottom-0 text-center rounded-lg w-100 bg-blue-900 text-white shadow-lg active:shadow-sm hover:cursor-pointer"
            >
              Save Image
            </div>
        </div>
      </section>
      {showServerSettings && (
        <ServerSettings
          showServerSettings={showServerSettings}
          setShowServerSettings={setShowServerSettings}
        />
      )}
    </>
  );
}

//  const response = await fetch("https://api.runpod.ai/v2/YOUR_POD_ID/run", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//     "Authorization": "Bearer YOUR_API_KEY"
//   },
//   body: JSON.stringify({
//     input: {
//       workflow: yourWorkflowJSON,
//       prompt: "A cyberpunk city at night, neon lights"
//     }
//   })
// });

// const result = await response.json();
// console.log(result);
