import { useState } from "react";
import Button from "../components/Button";
import ServerSettings from "./ServerSettings";

export default function Dashboard() {
  const [showDropDown, setShowDropDown] = useState(false);
  const [showServerSettings, setShowServerSettings] = useState(false);

  //   handle drop down menu
  const handleDropDown = () => {
    setShowDropDown(!showDropDown);
  };

  //handle open file manager
  const handOpenFile = (e: any) => {
    const file = e.target.files[0];
    if (file) console.log(file);
  };

  const handleShowServerSettings = () => {
    setShowServerSettings(!showServerSettings);
    setShowDropDown(!showDropDown);
  };

  return (
    <>
      {/* Header */}
      <section>
        <div className="flex gap-4 p-4 border items-center justify-center">
          <label
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
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-center mt-10">
          <div className=" relative grid grid-cols-2 gap-10 border p-10 rounded-lg">
            <p className="absolute ml-2">Text Inputs</p>
            <div className="border">
              <textarea name="text" id=""></textarea>
            </div>
            <div className="border">
              <textarea name="area" id=""></textarea>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-20">
        <div className="flex items-center justify-center">
          <div className="relative flex items-center justify-center border text-center h-100 w-100">
            <p>Generated Image</p>
            <div className="bottom-0 absolute w-100 bg-green-500">
              Save Image
            </div>
          </div>
        </div>
      </section>
      {showServerSettings && <ServerSettings showServerSettings={showServerSettings} setShowServerSettings={setShowServerSettings} />}
    </>
  );
}
